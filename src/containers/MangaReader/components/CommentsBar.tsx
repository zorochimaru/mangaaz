import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from "@ant-design/icons";
import { Tooltip, Button, Form, Comment, notification, message } from "antd";
import Avatar from "antd/lib/avatar/avatar";

import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import React, { useState, createElement, useEffect, useRef } from "react";
import { getDB } from "../../../config/db";
import { useUser } from "../../../HOC/AuthContext";
import { usePage } from "../../../HOC/PageContext";
import { MiniUser, PageComment } from "../../../models/PageComment.model";
import { Roles } from "../../../models/User.model";

const CommentsBar = () => {
    const [action, setAction] = useState<string | null>(null);
    const { user } = useUser();
    const { page } = usePage();
    const [pageCommentList, setPageCommentList] = useState<PageComment[]>([]);


    const like = (likes, author: MiniUser) => {
        if (likes.some(like => like.authorId !== user?.id)) {

            const like = {
                authorId: author.authorId,
                authorImg: author.authorImg,
                authorName: author.authorName
            }
            const hide = message.loading('Action in progress..', 0);
            getDB('comment-library')
                ?.collection('comments').findOneAndUpdate({ imgId: page?.imgId }, { $addToSet: { likes: like } }).then((res) => {
                    console.log(res);
                    notification['success']({
                        message: 'Success',
                        placement: 'bottomRight',
                        description:
                            'Like added!',
                    });

                }).finally(() => setTimeout(hide, 0)).catch((error) => {
                    notification['error']({
                        placement: 'bottomRight',
                        message: error.errorCodeName,
                        description: error.message,
                    });

                });
            setAction('liked');
        } else {
            // getDB('comment-library')
            // ?.collection('comments').findOneAndDelete({ imgId: page?.imgId }, { likes: like }).then((res) => {
            //     console.log(res);
            //     notification['success']({
            //         message: 'Success',
            //         placement: 'bottomRight',
            //         description:
            //             'Like added!',
            //     });

            // }).finally(() => setTimeout(hide, 0)).catch((error) => {
            //     notification['error']({
            //         placement: 'bottomRight',
            //         message: error.errorCodeName,
            //         description: error.message,
            //     });

            // });
            setAction('unliked');
        }


    };
    useEffect(() => {
        const hide = message.loading('Action in progress..', 0);
        getDB('comment-library')
            ?.collection('comments').find({ imgId: page?.imgId }).then((res) => {
                setPageCommentList(res);
                notification['success']({
                    message: 'Success',
                    placement: 'bottomRight',
                    description:
                        'Comments loaded!',
                });
            }).finally(() => setTimeout(hide, 0)).catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });

            });

    }, [page])
    const actions: any[] = [

    ];

    if (user?.role === Roles.MODERATOR || Roles.ADMIN) {
        actions.push(<span key="comment-basic-reply-to">Delete</span>)
    }



    const Editor = ({ onChange, onSubmit, submitting, value }) => (
        <div style={{ position: 'fixed', bottom: 0, width: '23%' }}>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Add Comment
            </Button>
            </Form.Item>
        </div>
    );
    function handleTest() {

        console.log(page?.imgId);

    }
    function postComment(comment) {
        console.log(comment);
    }
    return (
        <>
            <div style={{
                height: '62vh',
                overflowY: 'scroll',
                scrollbarWidth: 'thin'
            }}>
                <Button onClick={handleTest}>See</Button>

                {pageCommentList.map(comment => (

                    <Comment
                        key={comment._id.toHexString()}
                        actions={[
                            <Tooltip key="comment-basic-like" title="Like">
                                <span onClick={() => like(comment.likes, {
                                    authorId: user?.id,
                                    authorImg: user?.img,
                                    authorName: user?.name
                                })}>
                                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                                    <span className="comment-action">{comment.likes.length}</span>
                                </span>
                            </Tooltip>, ...actions,
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
                ))}


            </div>

            <Editor
                onChange={postComment}
                onSubmit={postComment}
                submitting={false}
                value={'adasdas'}
            />
        </>
    )
}

export default CommentsBar
