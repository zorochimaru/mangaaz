import { BarChartOutlined } from "@ant-design/icons";
import { Link, Location } from "@reach/router";
import { Divider, Menu } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useState } from "react";
 
/*
TODOS
////////////////////////////////

////////////////////////////////

*/
interface Route {
    path: string,
    pathName: string,
    icon: JSX.Element,
}
const ROUTES: Route[] = [
    {
        path: 'statistics',
        pathName: 'Statistika',
        icon: <BarChartOutlined />,
    }
]
const ReaderPanel = (props: any) => {
    const [menuItems] = useState(ROUTES);

    return (
        <div>
            <Title level={2}>Oxucu paneli</Title>
            <Divider orientation="left"></Divider>
            <Location>
                {props => {
                    return (
                        <>
                            <Menu mode="horizontal" selectedKeys={[props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1)]}>

                                {menuItems.map((route: Route) => {
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

export default ReaderPanel
