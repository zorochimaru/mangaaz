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
    public: boolean
}
const ROUTES = [
 
]
const ReaderPanel = (props: any) => {
    const [menuItems] = useState(ROUTES);

    return (
        <div>
            <Title level={2}>Reader panel</Title>
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
