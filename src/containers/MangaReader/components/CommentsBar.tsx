import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from "@ant-design/icons";
import { Tooltip, Button, Form, Comment } from "antd";
import Avatar from "antd/lib/avatar/avatar";

import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import React, { useState, createElement } from "react";
import { useUser } from "../../../HOC/AuthContext";
import { Roles } from "../../../models/User.model";

const CommentsBar = () => {
    const [likes, setLikes] = useState(0);
    const [action, setAction] = useState<string | null>(null);
    const { user } = useUser();

    const like = () => {
        setLikes(1);
        setAction('liked');
    };

    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
            <span onClick={like}>
                {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{likes}</span>
            </span>
        </Tooltip>

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
    return (
        <>
            <div style={{
                height: '62vh',
                overflowY: 'scroll',
                scrollbarWidth: 'thin'
            }}>
                <Comment
                    actions={actions}
                    author={<a>Han Solo</a>}
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    }
                />
                <Comment
                    actions={actions}
                    author={<a>Han Solo</a>}
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    }
                />
                <Comment
                    actions={actions}
                    author={<a>Han Solo</a>}
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    }
                />
            </div>

            <Editor
                onChange={setLikes}
                onSubmit={setLikes}
                submitting={false}
                value={'adasdas'}
            />
        </>
    )
}

export default CommentsBar
