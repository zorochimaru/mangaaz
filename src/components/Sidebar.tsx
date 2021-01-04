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
        public: true
    },
    {
        path: '/most-raited',
        pathName: 'Most Raited',
        icon: <StarOutlined />,
        public: true
    }
]

const Sidebar = () => {
    const { user } = useContext(UserContext);
    const [menuItems, setmenuItems] = useState(ROUTES)
    useEffect(() => {
        setmenuItems(m => m.filter(menu => menu.public));
        if (user?.role === Roles.ADMIN) {
            setmenuItems(m => [{
                path: '/admin-panel',
                pathName: 'Admin panel',
                icon: <EditOutlined />,
                public: false
            }, ...m
            ])
        }
        if (user?.role === Roles.MODERATOR) {
            setmenuItems(m => [{
                path: '/moderator-panel',
                pathName: 'Moderator panel',
                icon: <EditOutlined />,
                public: false
            }, ...m
            ])
        }
        if (user?.role === Roles.READER) {
            setmenuItems(m => [{
                path: '/reader-panel',
                pathName: 'Reader panel',
                icon: <EditOutlined />,
                public: false
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
                        <Menu theme="dark" mode="inline" selectedKeys={[props.location.pathname]}>

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