
import React, { useMemo } from 'react';
import { RouteComponentProps } from "@reach/router"
import { CSSProperties, useEffect, useState } from "react";
import { getDB } from "../../config/db";
import { Chapter } from "../../models/ChapterPage.model";
import { Button, Drawer, Select } from "antd";
import { ColumnWidthOutlined, CommentOutlined } from "@ant-design/icons";
import CommentsBar from './components/CommentsBar';

import PageViewer from './components/PageViewer';
import { PageContext, PageFactory } from '../../HOC/PageContext';
 
////////////////////////////////////////////////////////////////
// Add chapter select
// Add comment section
// Move all styles to css or object
////////////////////////////////////////////////////////////////

const MangaReader: React.FC<RouteComponentProps | any> = (props) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [pageHeight, setPageHeigth] = useState('auto');
    const [pageWidth, setPageWidth] = useState('auto');
    const [currView, setCurrView] = useState<number>(0);
    const [showComments, setShowComments] = useState(false);
    const [page, setPage] = useState<any>(null);
    const [sortType, setSortType] = useState('likes');
    const pageFactory = useMemo<PageFactory>(() => ({ page, setPage }), [page, setPage]);
    useEffect(() => {
        getDB('manga-library')
            .collection('chapters').findOne({ mangaId: props.mangaId }).then((chapter: any) => {
                setChapter(chapter)
            });
    }, [props])
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



    return (
        <PageContext.Provider value={pageFactory}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'fixed',
                    top: 10,
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
                    <span style={{ fontWeight: 'bold', zIndex: 3, color: 'white' }}>Chpapter number: {chapter?.number}</span>
                </div>
                <div style={{
                    position: 'fixed',
                    top: 10,
                    right: 200,
                    zIndex: 3
                }}>
                    <Button
                        type="default"
                        icon={<CommentOutlined />}
                        size={'large'}
                        onClick={onOpenComments}
                    />
                </div>
                <Drawer
                    title="Comments"
                    placement="right"
                    closable={false}
                    destroyOnClose={true}
                    onClose={onCloseComments}
                    visible={showComments && !!chapter}
                    width={'25%'}
                >
                    <Select defaultValue="likes" style={{ width: 130, position: 'fixed', top: 10, right: 20 }} onChange={handleSortChange}>
                        <Select.Option value="date">By Date</Select.Option>
                        <Select.Option value="likes">By Popularity</Select.Option>
                    </Select>
                    <CommentsBar sortType={sortType} firstPage={chapter?.pages[0]} />
                </Drawer>

                <div style={{ display: 'flex', width: '100%', textAlign: 'center', flexFlow: 'column wrap', rowGap: 20 }}>
                    {chapter?.pages.map((page, index) => (
                        <PageViewer key={page.imgId} page={page} pageWidth={pageWidth} pageHeight={pageHeight} />
                    ))}
                </div>

            </div>
        </PageContext.Provider>
    )

}
export default MangaReader
const styles: { [key: string]: CSSProperties } = {
    page: {

    }
}