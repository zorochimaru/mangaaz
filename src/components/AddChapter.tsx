import { UploadOutlined } from "@ant-design/icons"
import { RouteComponentProps } from "@reach/router"
import { Upload, Button, Image, Select } from "antd"
import { Option } from "antd/lib/mentions";
import React, { useState } from "react"
import * as XLSX from 'xlsx';
import { ChapterPage } from "../models/ChapterPage.model";
import * as db from '../config/db';

const AddChapter: React.FC<RouteComponentProps | any> = () => {
    const [pagesData, setPagesData] = useState<ChapterPage[]>([]);
    const [fileList, setFileList] = useState<any>([]);
    const [manga, setManga] = useState<any>(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mangaList, setMangaList] = useState([]);

    const readExel = (file: any) => {

        const promise = new Promise<any[]>((resolve, reject) => {
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
        promise.then((d) => {
            const newList: ChapterPage[] = [];
            d.forEach((element, i) => {
                if (i > 0 && element.Id) {
                    newList.push({
                        id: element.Id,
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
    const handleSearch = (value: string) => {
        if (value) {

            db.getDB('manga-library')
                .collection('titles').find({ 'title': { $regex: `.*${value}.*` } }).asArray().then((mangaList: any) => {
                    setIsLoaded(true);
                    setMangaList(mangaList)
                }).catch((err: any) =>
                    setError(err)
                )
        } else {
            setMangaList([]);
        }
    };

    const handleChange = (value: string) => {
        setManga(value);
        console.log(value);
    };

    return (
        <div>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select manga"
                filterOption={false}
                notFoundContent={null}
                onChange={handleChange}
                onSearch={handleSearch}
            >
                {mangaList.map((d: any) => <Option key={d._id}>{d.title}</Option>)}
            </Select>
            <div style={{ width: 250, padding: 20 }}>
                <Upload accept={'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
                    {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Select exel file</Button>
                </Upload>
            </div>
            <Image.PreviewGroup>
                {pagesData.map((page: any) => {
                    return (
                        <Image
                            key={page.id}
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

export default AddChapter