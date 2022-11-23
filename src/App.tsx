import * as React from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router';
import Routes from './routes';
import './App.css';

function App() {
  const history = useHistory();

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" onClick={() => history.push('/signer')}>
            Signer
          </Menu.Item>
          <Menu.Item key="2" onClick={() => history.push('/verifier')}>
            Verifier
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content>
        <Routes />
      </Layout.Content>
    </Layout>
  );
}

export default App;
