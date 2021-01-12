import { BookOutlined, DiffOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Location } from "@reach/router";
import { Divider, Menu } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useState } from "react";
/*
TODOS
////////////////////////////////
Show confirm dialog before delete
Make user controller
Make delete manga function ???
////////////////////////////////

*/

const ROUTES = [
    {
        path: 'new-manga',
        pathName: 'New manga',
        icon: <BookOutlined />,
        public: true
    },
    {
        path: 'chapter-controller',
        pathName: 'Chapter controller',
        icon: <DiffOutlined />,
        public: true
    },
    {
        path: 'user-controller',
        pathName: 'User controller',
        icon: <UserOutlined />,
        public: true
    }
]
const AdminPanel = (props: any) => {
    const [menuItems] = useState(ROUTES);

    return (
        <div>
            <Title level={2}>Admin panel</Title>
            <Divider orientation="left"></Divider>
            <Location>
                {props => {
                    return (
                        <>
                            <Menu mode="horizontal" selectedKeys={[props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1)]}>

                                {menuItems.map((route) => {
                                    return (
                                        <Menu.Item icon={route.icon} key={route.path}>
                                            <Link to={route.path}>{route.pathName}</Link>
                                        </Menu.Item>)
                                })}

                            </Menu>
                        </>
                    );
                }}
            </Location>

            {props.children}

        </div>
    )
}

export default AdminPanel
