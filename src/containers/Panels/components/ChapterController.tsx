import { UploadOutlined } from "@ant-design/icons"
import { RouteComponentProps } from "@reach/router"
import { Upload, Button, Image, Select, InputNumber, Row, Col, notification, message } from "antd"
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import { ChapterPage } from "../../../models/ChapterPage.model";
import * as db from '../../../config/db';
import { BSON } from "realm-web";

const ChapterController: React.FC<RouteComponentProps | any> = () => {
    const [pagesData, setPagesData] = useState<ChapterPage[]>([]);
    const [fileList, setFileList] = useState<any>([]);
    const [mangaId, setMangaId] = useState<any>(null);
    const [сhapterNumber, setChapterNumber] = useState<any>(null);
    const [mangaList, setMangaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existInDb, setExistInDb] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearchTitle(searchTerm);
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])
    function clearData() {
        setExistInDb(false);
        setPagesData([]);
        setMangaList([]);
        setChapterNumber(null);
        setMangaId(null);
        setFileList([]);
    }

    const readExel = (file: any) => {

        const convertExelToJSON = new Promise<any[]>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: 'buffer' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
        convertExelToJSON.then((d) => {
            const newList: ChapterPage[] = [];
            d.forEach((element, i) => {
                if (i > 0 && element.Id) {
                    newList.push({
                        imgId: element.Id,
                        title: element.Title,
                        owner: element.Owner,
                        size: element.Size,
                        googlePrev: element.URL,
                        thumbnail: `https://drive.google.com/thumbnail?authuser=0&sz=w200&id=${element.Id}`,
                        url: `https://drive.google.com/uc?export=view&id=${element.Id}`
                    })
                }
            })

            newList.sort((a: any, b: any) => {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            });
            setPagesData(newList);
        })
    }

    const uploadProps = {
        multiple: false,
        onRemove: () => {
            setPagesData([]);
            setFileList([]);
            return false;
        },
        beforeUpload: (newFile: any) => {
            readExel(newFile);
            return false;
        },
        onChange: (info: any) => {
            setFileList([]);
            setFileList([info.file]);
        },
        fileList
    }
    const handleSearchTitle = (value: string) => {
        setLoading(true);
        if (value) {
            db.getDB('manga-library')
                ?.collection('titles').find({ 'title': new RegExp(value, 'i') }).then((mangaList: any) => {
                    setMangaList(mangaList)
                }).finally(() => setLoading(false)).catch((error: any) =>
                    notification['error']({
                        placement: 'bottomRight',
                        message: error.errorCodeName,
                        description: error.message,
                    })
                )
        } else {
            setLoading(false);
            setMangaList([]);
        }
    };

    const handleChange = (value: string) => {
        setMangaId(value);
    };

    const handleSubmit = () => {
        const hide = message.loading('Fəaliyyət davam edir...', 0);
        db.getDB('manga-library')
            ?.collection('chapters').updateOne({ number: сhapterNumber }, {
                $set: {
                    mangaId: mangaId,
                    number: сhapterNumber,
                    pages: pagesData,
                }
            }, { upsert: true }).then(() => {
                db.getDB('manga-library')
                    ?.collection('titles').updateOne({ _id: new BSON.ObjectId(mangaId) },
                         { $inc: { chaptersCount: 1 }, $set: { lastUpdDate: new Date() } }).then(() => {
                        notification['success']({
                            message: 'Success',
                            placement: 'bottomRight',
                            description:
                                'Fəsil əlavə edildi!',
                        });
                        clearData();
                    })
            }).finally(() => setTimeout(hide, 0)).catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });

            });
    };

    const handleSearchChapter = () => {
        const hide = message.loading('Fəaliyyət davam edir...', 0);
        db.getDB('manga-library')
            ?.collection('chapters').findOne({ mangaId: mangaId, number: сhapterNumber }).then((chapter: any) => {
                setPagesData(chapter.pages);
                setExistInDb(true);
            }).finally(() => setTimeout(hide, 0)).catch(error => {
                setExistInDb(false);
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });
            });

    }
    const handleDeleteChapter = () => {
        const hide = message.loading('Fəaliyyət davam edir...', 0);

        db.getDB('manga-library')
            ?.collection('chapters').deleteOne({ mangaId: mangaId, number: сhapterNumber }).then(() => {
                db.getDB('manga-library')
                    ?.collection('titles').updateOne({ mangaId: mangaId }, { $inc: { chaptersCount: -1 } }).then(() => {
                        notification['success']({
                            message: 'Success',
                            placement: 'bottomRight',
                            description:
                                'Fəsil silindi!',
                        });
                        clearData();
                    });
            }).finally(() => setTimeout(hide, 0)).catch(error => {
                setExistInDb(false);
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });
            });
    }
    return (
        <div>
            <Row style={{ marginTop: 20, marginBottom: 20 }}>
                <Col span={3}>
                    <Select
                        loading={loading}
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Manqa seçin"
                        filterOption={false}
                        notFoundContent={null}
                        onChange={handleChange}
                        onSearch={setSearchTerm}
                        value={mangaId}
                    >
                        {mangaList.map((d: any) => <Option key={d._id}>{d.title}</Option>)}
                    </Select>
                </Col>
                <Col offset={2} span={1}>
                    <InputNumber min={0} defaultValue={0} value={сhapterNumber} onChange={(num) => setChapterNumber(num)} />
                </Col>
                <Col offset={2} span={4}>

                    <Upload accept={'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
                        {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Excel faylını seçin</Button>
                    </Upload>

                </Col>
                <Col offset={1} span={3}>
                    <Button onClick={handleSearchChapter} type="default"
                        disabled={
                            fileList.length !== 0
                            || !сhapterNumber
                            || !mangaId}
                    >Yükləmə fəsli</Button>
                </Col>
                <Col span={1}>
                    <Button onClick={handleSubmit} type="primary" disabled={fileList.length === 0}>Fəsli saxla</Button>
                </Col>
                <Col span={1} offset={5}>
                    <Button onClick={handleDeleteChapter} type="primary" danger disabled={!existInDb}>Fəsli silin</Button>
                </Col>
            </Row>
            <Image.PreviewGroup>
                {pagesData.map((page: any) => {
                    return (
                        <Image
                            key={page.imgId}
                            width={100}
                            src={page.thumbnail}
                            preview={{
                                src: page.url,
                            }}
                        />
                    )
                })}
            </Image.PreviewGroup>
        </div>
    )
}

export default ChapterController