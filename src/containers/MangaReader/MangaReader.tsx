
import React, { useCallback, useMemo, useRef } from 'react';
import { navigate, RouteComponentProps } from "@reach/router"
import { useEffect, useState } from "react";
import { getDB } from "../../config/db";
import { Chapter } from "../../models/ChapterPage.model";
import { Button, Drawer, Dropdown, Menu, notification, Select, Spin } from "antd";
import { BarsOutlined, BulbOutlined, ColumnWidthOutlined, CommentOutlined, CopyOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import CommentsBar from './components/CommentsBar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import PageViewer from './components/PageViewer';
import { PageContext, PageFactory } from '../../HOC/PageContext';
import { BSON } from 'realm-web';
import { useUser } from '../../HOC/AuthContext';
import './MangaReader.css';

// Move all styles to css or object

const MangaReader: React.FC<RouteComponentProps | any> = (props) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [pageHeight, setPageHeigth] = useState('auto');
    const [pageWidth, setPageWidth] = useState('auto');
    const [currView, setCurrView] = useState<number>(2);
    const [showComments, setShowComments] = useState(false);
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chapterId, setChapterId] = useState(props.chapterId);
    const [mangaId] = useState(props.mangaId);
    const [chapterNumber, setChapterNumber] = useState(0);
    const [chapterList, setChapterList] = useState<any>([]);
    const [sortType, setSortType] = useState('likes');
    const [dark, setDark] = useState(false);
    const mangaSelectRef = useRef<any>('');
    const pageFactory = useMemo<PageFactory>(() => ({ page, setPage }), [page, setPage]);
    const { user } = useUser();

    const fetchNear10Chapters = useCallback(
        () => {
            getDB('manga-library')
                ?.collection('chapters').find({
                    $or: [
                        { number: { $gt: chapterNumber, } },
                        { number: { $lt: chapterNumber, } }
                    ]
                }, { limit: 10 }).then(res => {
                    if (res) {
                        setChapterList(res);
                    }
                })
        },
        [chapterNumber],
    )
    useEffect(() => {
        fetchNear10Chapters();
    }, [fetchNear10Chapters]);
    useEffect(() => {
        getDB('manga-library')
            .collection('chapters').findOne({ _id: new BSON.ObjectId(chapterId) }).then((chapter: Chapter) => {
                setChapterNumber(chapter.number);
                setChapter(chapter);
                setLoading(false);
            });
    }, [chapterId]);

    function onChangeView() {
        if (currView === 0) {
            setPageHeigth('89vh');
            setPageWidth('auto');
        }
        if (currView === 1) {
            setPageHeigth('auto');
            setPageWidth('auto');
        }
        if (currView === 2) {
            setPageHeigth('auto');
            setPageWidth('100%');
            setCurrView(-1)
        }
        setCurrView(c => c + 1);
    }
    function onOpenComments() {
        setShowComments(true)
    }
    function onCloseComments() {
        setShowComments(false)
    }
    function handleSortChange(value) {
        setSortType(value);
    }
    const handleMangaChapterChange = (value) => {
        if (value) {
            const valueObj = JSON.parse(value);
            setChapterId(valueObj.id);
            navigate(`/manga-reader/${mangaId}/${valueObj.id}`);
        }
    };

    function goToNextChapter() {
        getDB('manga-library')
            ?.collection('chapters')
            .findOne({ number: { $gt: chapterNumber } })
            .then((res: Chapter) => {
                if (res) {
                    setChapterId(res._id.toHexString());
                    navigate(`/manga-reader/${mangaId}/${res._id.toHexString()}`);
                    getDB('progress-library')
                        .collection('lastReadedChapter')
                        .updateOne({ mangaId: mangaId, userId: user?.id }, {
                            $set: { chapterId: res?._id.toHexString() }
                        }, { upsert: true });
                } else {
                    console.log('Last one');
                    navigate(`/manga-details/${mangaId}`);
                }
            });
    }
    const handleSearchTitle = (value: string) => {
        setLoading(true);
        if (value) {
            getDB('manga-library')
                ?.collection('chapters').find({ 'number': +value }).then((mangaList: any) => {
                    setLoading(false);
                    setChapterList(mangaList);
                }).catch((error: any) =>
                    notification['error']({
                        placement: 'bottomRight',
                        message: error.errorCodeName,
                        description: error.message,
                    })
                )
        } else {
            fetchNear10Chapters();
            setLoading(false);
        }
    };
    function onToggleLight() {
        setDark(d => !d);
    }
    function onCopyLink() {

        document.execCommand('copy');
        notification.open({
            message: 'Link kopyalandı',
            placement: 'bottomRight',
        });
    }
    const url = window.location.href;
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Button
                    type="default"
                    icon={<BulbOutlined />}
                    size={'large'}
                    style={{ marginRight: 10 }}
                    onClick={onToggleLight}
                />
            </Menu.Item>

            <Menu.Item key="1">
                <CopyToClipboard text={url}>
                    <Button
                        type="default"
                        icon={<CopyOutlined />}
                        size={'large'}
                        style={{ marginRight: 10 }}
                        onClick={onCopyLink}
                    />
                </CopyToClipboard>


            </Menu.Item>


        </Menu>
    );

    return (
        <PageContext.Provider value={pageFactory}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'fixed',
                    top: 10,
                    left: 200,
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <Button
                        type="default"
                        icon={<ColumnWidthOutlined />}
                        size={'large'}
                        onClick={onChangeView}
                    />

                    <Select
                        loading={loading}
                        showSearch
                        style={{ width: 90 }}
                        placeholder={chapter?.number}
                        filterOption={false}
                        notFoundContent={loading ? <Spin size="small" /> : null}
                        onChange={handleMangaChapterChange}
                        onSearch={handleSearchTitle}
                        allowClear={true}
                        ref={mangaSelectRef}
                        onClear={fetchNear10Chapters}
                    >
                        {chapterList.map((d: Chapter) => (
                            <Select.Option
                                value={JSON.stringify({ number: d.number, id: d._id.toHexString() })}
                                key={d._id.toHexString()}>{d.number}</Select.Option>))}
                    </Select>
                    <Button
                        type="default"
                        icon={<VerticalLeftOutlined />}
                        size={'large'}
                        onClick={goToNextChapter}
                    />

                </div>
                <div style={{
                    position: 'fixed',
                    top: 10,
                    right: 160,
                    zIndex: 3
                }}>
                    <Dropdown overlay={menu} trigger={['click']}>

                        <Button
                            type="default"
                            icon={<BarsOutlined />}
                            size={'large'}
                            style={{ marginRight: 10 }}
                        />

                    </Dropdown>

                    <Button
                        type="default"
                        icon={<CommentOutlined />}
                        size={'large'}
                        onClick={onOpenComments}
                    />
                </div>
                <Drawer
                    title="Şərhlər"
                    placement="right"
                    closable={false}
                    destroyOnClose={true}
                    onClose={onCloseComments}
                    visible={showComments && !!chapter}
                    width={'25%'}
                >
                    <Select defaultValue="likes" style={{ width: 130, position: 'fixed', top: 10, right: 20 }} onChange={handleSortChange}>
                        <Select.Option value="date">Tarixə görə</Select.Option>
                        <Select.Option value="likes">Populyarlıqla</Select.Option>
                    </Select>
                    <CommentsBar sortType={sortType} firstPage={chapter?.pages[0]} />
                </Drawer>
                <div className="wrapper" style={{ zIndex: 2, width: currView === 0 ? 'auto' : 'max-content' }}>
                    {chapter?.pages.map((page) => (
                        <PageViewer key={page.imgId} page={page} pageWidth={pageWidth} pageHeight={pageHeight} />
                    ))}
                </div>

            </div>
            <div style={{
                background: 'rgba(0,0,0,.7)',
                right: 0, left: 0, top: 0, bottom: 0, position: 'fixed', zIndex: dark ? 1 : -1
            }}></div>

        </PageContext.Provider>
    )

}
export default MangaReader
