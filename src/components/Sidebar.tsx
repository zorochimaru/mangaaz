import React from 'react'
import { Menu } from 'antd';
import logo from '../logo.png';
import {
    HomeOutlined,
    StarOutlined
} from '@ant-design/icons';
import { Link, Location } from '@reach/router';

const ROUTES = [
    {
        path: '/',
        pathName: 'Home',
        icon: <HomeOutlined />
    },
    {
        path: '/most-raited',
        pathName: 'Most Raited',
        icon: <StarOutlined />
    }
]


const Sidebar = () => {
    return (
        <Location>
            {props => {
                return (
                    <>
                        <Link to='/'><img src={logo} alt="logo" style={styles.logo} /></Link>
                        <Menu theme="dark" mode="inline" selectedKeys={[props.location.pathname]}>

                            {ROUTES.map((route) => {
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

    )
}

const styles = {
    logo: {
        width: '100%'
    },

}

export default Sidebar;