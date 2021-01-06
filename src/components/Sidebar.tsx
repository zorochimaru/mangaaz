import React, { useContext, useEffect, useState } from 'react'
import { Menu } from 'antd';
import logo from '../logo.png';
import {
    EditOutlined,
    HomeOutlined,
    StarOutlined
} from '@ant-design/icons';
import { Link, Location } from '@reach/router';
import { UserContext } from '../HOC/AuthContext';
import { Roles } from '../models/User.model';

const ROUTES = [
    {
        path: '/',
        pathName: 'Home',
        icon: <HomeOutlined />,
    },
    {
        path: '/most-raited',
        pathName: 'Most Raited',
        icon: <StarOutlined />,

    }
]

const Sidebar = () => {
    const { user } = useContext(UserContext);
    const [menuItems, setmenuItems] = useState(ROUTES)
    useEffect(() => {
        setmenuItems(m => m.filter((menu: any) => !menu.private));
        if (user?.role === Roles.ADMIN) {
            setmenuItems(m => [{
                path: '/admin-panel',
                pathName: 'Admin panel',
                icon: <EditOutlined />,
                private: true
            }, ...m
            ])
        }
        if (user?.role === Roles.MODERATOR) {
            setmenuItems(m => [{
                path: '/moderator-panel',
                pathName: 'Moderator panel',
                icon: <EditOutlined />,
                private: true
            }, ...m
            ])
        }
        if (user?.role === Roles.READER) {
            setmenuItems(m => [{
                path: '/reader-panel',
                pathName: 'Reader panel',
                icon: <EditOutlined />,
                private: true
            }, ...m
            ])
        }
    }, [user])
    return (
        <Location>
            {props => {
                return (
                    <>
                        <Link to='/'><img src={logo} alt="logo" style={styles.logo} /></Link>
                        <Menu theme="dark" mode="inline" selectedKeys={['/' + props.location.pathname.split('/')[1]]}>

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

    )
}

const styles = {
    logo: {
        width: '100%'
    },

}

export default Sidebar;