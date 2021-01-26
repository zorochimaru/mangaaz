import React, { CSSProperties, useMemo, useState } from 'react'
import { RouteComponentProps, Router } from '@reach/router';
import './App.css'
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Home from './containers/Home/Home';
import Title from 'antd/lib/typography/Title';
import MangaDetails from './containers/MangaDetails/MangaDetails';
import Reader from './containers/Panels/ReaderPanel/ReaderPanel';
import Auth from './components/Auth';
import { UserContext } from './HOC/AuthContext';
import { PrivateRoute } from './HOC/AuthGuard';
import ModeratorPanel from './containers/Panels/ModeratorPanel/ModeratorPanel';
import { Roles } from './models/User.model';
import AdminPanel from './containers/Panels/AdminPanel/AdminPanel';
import ChapterController from './containers/Panels/components/ChapterController';
import MangaController from './containers/Panels/AdminPanel/pages/MangaController';
import UserController from './containers/Panels/AdminPanel/pages/UserController';
import ReaderPanel from './containers/Panels/ReaderPanel/ReaderPanel';



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
  const [user, setUser] = useState<any>(null);
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
                <MangaController path="manga-controller" />
                <ChapterController path="chapter-controller" />
                <UserController path="user-controller" />
              </PrivateRoute>
              <PrivateRoute role={Roles.MODERATOR} as={ModeratorPanel} path="moderator-panel">
                <ChapterController path="chapter-controller" />
              </PrivateRoute>
              <MangaDetails path="manga-details/:id" />
              <PrivateRoute role={Roles.READER} as={ReaderPanel} path="reader-panel">
              </PrivateRoute>
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
