import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { Tooltip, Button, Form, Comment, notification, Popconfirm, Skeleton } from "antd";
import Avatar from "antd/lib/avatar/avatar";

import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import React, { useState, createElement, useEffect } from "react";
import { BSON } from "realm-web";
import { getDB } from "../../../config/db";
import { useUser } from "../../../HOC/AuthContext";
import { usePage } from "../../../HOC/PageContext";
import { MiniUser, PageComment } from "../../../models/PageComment.model";
import { Roles } from "../../../models/User.model";

const CommentsBar = ({ firstPage, sortType }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const { page } = usePage();
    const [pageCommentList, setPageCommentList] = useState<PageComment[]>([]);
    const [newComment, setNewComment] = useState('');

    const like = (likes: MiniUser[], author: MiniUser) => {
        if (likes.some(like => like.authorId === author.authorId)) {

            getDB('comment-library')
                ?.collection('comments').updateOne({ imgId: page?.imgId },
                    { $pull: { "likes": { authorId: author.authorId } } }).then(() => {
                        fetchComments();
                    }).finally().catch((error) => {
                        notification['error']({
                            placement: 'bottomRight',
                            message: error.errorCodeName,
                            description: error.message,
                        });

                    });

        } else {

            const like = {
                authorId: author.authorId,
                authorImg: author.authorImg,
                authorName: author.authorName
            }
            getDB('comment-library')
                ?.collection('comments').updateOne({ imgId: page?.imgId }, { $addToSet: { likes: like } }).then(() => {
                    fetchComments();
                }).finally().catch((error) => {
                    notification['error']({
                        placement: 'bottomRight',
                        message: error.errorCodeName,
                        description: error.message,
                    });

                });

        }


    };
    useEffect(() => {
        fetchComments();
    }, [page])

    function onDeleteCommnent(comment: PageComment) {
        getDB('comment-library')
            ?.collection('comments').deleteOne({ authorId: comment.authorId }).then(() => {
                fetchComments();
            }).finally(() => null).catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });
            });
    }

    function fetchComments() {

        setLoading(true);
        getDB('comment-library')
            ?.collection('comments').find({ imgId: page?.imgId || firstPage.imgId }).then((res) => {
                setPageCommentList(res);
            }).finally(() => setLoading(false)).catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });

            });
    }


    function postComment() {

        const newCommentObj: PageComment = {
            _id: new BSON.ObjectId(),
            authorId: user?.id || 'NA',
            authorImg: user?.img || 'NA',
            authorName: user?.name || 'Anonim',
            date: moment().toDate(),
            imgId: page?.imgId || firstPage.imgId,
            likes: [],
            text: newComment
        }
        getDB('comment-library')
            ?.collection('comments').insertOne(newCommentObj).then(() => {
                fetchComments();
                setNewComment('');
            }).finally(() => null).catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });

            });


    }
    const deleteButton = (comment: PageComment) =>
        (user?.role === Roles.MODERATOR
            || Roles.ADMIN
            || user?.id === comment.authorId) ?
            (
                <Popconfirm
                    placement="bottom"
                    title={'Silmək istədiyinizə əminsiniz?'}
                    onConfirm={() => onDeleteCommnent(comment)}
                    okText="Bəli"
                    cancelText="Yox"
                >
                    <span>Sil</span>
                </Popconfirm>
            ) : null

    const likeButton = (comment: PageComment) => (
        (user?.id !== comment.authorId) ?
            <Tooltip key="comment-basic-like" title="Like">
                <span onClick={() => like(comment.likes, {
                    authorId: user?.id,
                    authorImg: user?.img,
                    authorName: user?.name
                })}>
                    {createElement(
                        comment.likes.some(like => like.authorId === user?.id)
                            ? LikeFilled : LikeOutlined)}
                    <span className="comment-action">{comment.likes.length}</span>
                </span>
            </Tooltip> : null
    )
    function handleChangeNewComment(e) {
        setNewComment(e.target.value);
    }
    function sortByDate() {
        return pageCommentList.sort((a, b) => +b.date - +a.date)
    }
    function sortByPop() {
        return pageCommentList.sort((a, b) => {
            if (a.likes.length > b.likes.length) {
                return -1;
            }
            if (a.likes.length < b.likes.length) {
                return 1;
            }
            // a должно быть равным b
            return 0;
        })
    }
    function handleSortType() {
        return sortType === 'likes' ? sortByPop() : sortByDate()
    }
    return (
        <>
            <div style={{
                height: '62vh',
                overflowY: 'scroll',
                scrollbarWidth: 'thin'
            }}>
                {loading ? <Skeleton avatar paragraph={{ rows: 4 }} /> :

                    handleSortType().map(comment => (

                        <Comment
                            key={comment._id.toHexString()}
                            actions={[
                                likeButton(comment),
                                deleteButton(comment)
                            ]}
                            author={comment.authorName}
                            avatar={
                                <Avatar
                                    src={comment.authorImg}
                                    alt={comment.authorName}
                                />
                            }
                            content={
                                <p>
                                    {comment.text}
                                </p>
                            }
                            datetime={

                                <span>{moment(comment.date).format('DD-MM-YYYY HH:mm')}</span>

                            }
                        />
                    ))

                }

            </div>
            <div style={{ position: 'fixed', bottom: 0, width: '23%' }}>
                <Form.Item>
                    <TextArea rows={4} onChange={handleChangeNewComment} value={newComment} />
                </Form.Item>
                <Form.Item>
                    <Button disabled={!newComment} htmlType="submit" loading={false} onClick={postComment} type="primary">
                        Şərh əlavə edin
                    </Button>
                </Form.Item>
            </div>

        </>
    )
}

export default CommentsBar
