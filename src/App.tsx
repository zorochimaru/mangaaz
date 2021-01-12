import React, { CSSProperties, useMemo, useState } from 'react'
import { RouteComponentProps, Router } from '@reach/router';
import './App.css'
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Home from './containers/Home/Home';
import Title from 'antd/lib/typography/Title';
import MangaDetails from './containers/MangaDetails/MangaDetails';
import Reader from './containers/Reader/Reader';
import Auth from './components/Auth';
import { UserContext } from './HOC/AuthContext';
import { PrivateRoute } from './HOC/AuthGuard';
import AdminPanel from './containers/AdminPanel/AdminPanel';
import ModeratorPanel from './containers/ModeratorPanel/ModeratorPanel';
import { Roles } from './models/User.model';
import NewManga from './containers/AdminPanel/pages/NewManga';
import UserController from './containers/AdminPanel/pages/UserController';
import ChapterController from './components/ChapterController';

/*
TODOS
////////////////////////////////
Make reader page
Make Most Raited page separate
Add about page
Change logo
////////////////////////////////
*/


const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [mode, setMode] = useState(false);
  const [user, setUser] = useState({
    setUser: () => { },
    user: null
  });
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={value}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={mode} onCollapse={() => setMode(!mode)}>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">


          <Header className="site-layout-background" style={{
            padding: 0,
            height: 61,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }} >
            <Title style={{ color: '#fff', margin: 0, fontFamily: 'Trade Winds' }}>MangaAz</Title>
            <Auth />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Router style={styles.contentWrapper}>
              <Home path="/" />
              <PrivateRoute as={MostRaited} path="most-raited"></PrivateRoute>
              <PrivateRoute role={Roles.ADMIN} as={AdminPanel} path="admin-panel">
                <ChapterController path="chapter-controller" />
                <NewManga path="new-manga" />
                <UserController path="user-controller" />
              </PrivateRoute>
              <PrivateRoute role={Roles.MODERATOR} as={ModeratorPanel} path="moderator-panel"></PrivateRoute>
              <MangaDetails path="manga-details/:id" />
              <Reader path="reader/:id" />
            </Router>
          </Content>


          <Footer style={{ textAlign: 'center' }}>Some useless text ©</Footer>
        </Layout>
      </Layout >
    </UserContext.Provider>
  );
}
const MostRaited: React.FC<RouteComponentProps> = () => (
  <div>
    <h2>MostRaited</h2>
    <img src="https://yadi.sk/i/VyeEtbEali_DQg" alt="some" />
  </div>
);
const styles: { [key: string]: CSSProperties } = {
  mainWrapper: {
    display: 'flex',
  },
  contentWrapper: {
    padding: 20
  },

}
export default App;
