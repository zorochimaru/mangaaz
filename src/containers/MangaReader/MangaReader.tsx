
import React from 'react';
import { RouteComponentProps } from "@reach/router"
import { createElement, CSSProperties, useEffect, useState } from "react";
import { getDB } from "../../config/db";
import { Chapter } from "../../models/ChapterPage.model";
import LazyLoad from 'react-lazy-load';
import { Button, Comment, Drawer, Form, Tooltip } from "antd";
import { ColumnWidthOutlined, CommentOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons";
import moment from 'moment';
import Avatar from "antd/lib/avatar/avatar";
import TextArea from 'antd/lib/input/TextArea';
import CommentsBar from './components/CommentsBar';
////////////////////////////////////////////////////////////////
// Add chapter select
// Add comment section
// Make offset for load next page
// Move all styles to css or object
////////////////////////////////////////////////////////////////

const MangaReader: React.FC<RouteComponentProps | any> = (props) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [pageHeigth, setPageHeigth] = useState('auto');
    const [pageWidth, setPageWidth] = useState('auto');
    const [currView, setCurrView] = useState<number>(0);
    const [showComments, setShowComments] = useState(false);
    const imgElement = React.useRef<any>(null);
    const [currHeigth, setCurrHeigth] = useState(100);
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
        console.log(imgElement.current?.naturalHeight)
    }
    function onOpenComments() {
        setShowComments(true)
    }
    function onCloseComments() {
        setShowComments(false)
    }

    return (
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
                closable={true}
                onClose={onCloseComments}
                visible={showComments}
                width={'25%'}
            >
                <CommentsBar />
            </Drawer>
            <div style={{ display: 'flex', width: '100%', textAlign: 'center', flexDirection: 'column', rowGap: 20 }}>
                {chapter?.pages.map(page => (
                    <LazyLoad   offsetVertical={300} width={'100%'} key={page.imgId} >
                        <img ref={imgElement}
                            onLoad={() => setCurrHeigth(imgElement.current?.naturalHeight)} style={{ width: pageWidth, height: pageHeigth, objectFit: 'contain' }} src={page.url} />
                    </LazyLoad>
                ))}
            </div>
        </div>
    )

}
export default MangaReader
const styles: { [key: string]: CSSProperties } = {
    page: {

    }
}