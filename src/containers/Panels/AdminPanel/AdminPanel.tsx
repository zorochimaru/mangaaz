import { BookOutlined, DiffOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Location } from "@reach/router";
import { Divider, Menu } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useState } from "react";
/*
TODOS
////////////////////////////////

////////////////////////////////

*/

const ROUTES = [
    {
        path: 'manga-controller',
        pathName: 'Manqa nəzarətçisi',
        icon: <BookOutlined />,
    },
    {
        path: 'chapter-controller',
        pathName: 'Fəsil nəzarətçi',
        icon: <DiffOutlined />,
    },
    {
        path: 'user-controller',
        pathName: 'İstifadəçilər nəzarətçi',
        icon: <UserOutlined />,
    }
]
const AdminPanel = (props: any) => {
    const [menuItems] = useState(ROUTES);

    return (
        <div>
            <Title level={2}>İdarə paneli</Title>
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
