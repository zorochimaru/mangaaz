import React, { useState } from 'react'
import { RouteComponentProps, Router } from '@reach/router';
import './App.css'
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Home from './containers/Home/Home';
import Title from 'antd/lib/typography/Title';
import MangaDetails from './containers/MangaDetails/MangaDetails';


const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [mode, setMode] = useState(false);

  return (

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
          alignItems: 'center'
        }} >
          <Title style={{ color: '#fff', margin: 0, fontFamily: 'Trade Winds' }}>MangaAz</Title>
        </Header>
        <Content style={{ margin: '0 16px' }}>  
          <Router style={styles.contentWrapper}>
            <Home path="/" />
            <MostRaited path="most-raited" />
            <MangaDetails path="manga-details/:id"/>
          </Router>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Some useless text ©</Footer>
      </Layout>
    </Layout >
  );
}
const MostRaited: React.FC<RouteComponentProps> = () => (
  <div>
    <h2>MostRaited</h2>
  </div>
);
const styles = {
  mainWrapper: {
    display: 'flex',
  },
  contentWrapper: {
    padding: 20
  }
}
export default App;
