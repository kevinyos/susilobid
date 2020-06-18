import React, { useState } from 'react';

// children
import {
  HeaderDashboard,
  SiderDashboard
} from '../dashboard/container';
import {
  ManageSellers,
  ManageUsers,
  WalletVerif,
  SetBiddingRoom,
  ActiveAuctions
} from '../dashboard/pages';

// style
import { Layout } from 'antd';
const { Content } = Layout;

const App = () => {

  const components = {
    1: <ManageUsers />,
    2: <ManageSellers />,
    3: <WalletVerif />,
    4: <SetBiddingRoom />,
    5: <ActiveAuctions />
  };

  const [render, updateRender] = useState(1);

  const handleMenuClick = menu => {
    updateRender(menu.key);
  };

  return (
    <div className="App">
      <Layout>
        <HeaderDashboard />
        <Layout style={{ minHeight: "80vh" }}>
          <SiderDashboard handleClick={handleMenuClick} />
          <Layout>
            <Content>{components[render]}</Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;