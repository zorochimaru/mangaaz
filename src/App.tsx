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
