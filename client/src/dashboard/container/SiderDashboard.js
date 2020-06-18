import React from "react";
import { Menu, Layout } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  DollarOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

const SiderDashboard = ({handleClick}) => {
  return (
    <Layout.Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu
          key="sub1"
          title={
            <span className="d-flex align-items-center">
              <UserOutlined />
              Users
            </span>
          }
        >
          <Menu.Item key="1" onClick={handleClick}>
            Manage Users
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span className="d-flex align-items-center">
              <ShopOutlined />
              Sellers
            </span>
          }
        >
          <Menu.Item key="2" onClick={handleClick}>
            Manage Sellers
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub3"
          title={
            <span className="d-flex align-items-center">
              <DollarOutlined />
              Payment
            </span>
          }
        >
          <Menu.Item key="3" onClick={handleClick}>
            Wallet Verif
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub4"
          title={
            <span className="d-flex align-items-center">
              <SolutionOutlined />
              Auctions
            </span>
          }
        >
          <Menu.Item key="4" onClick={handleClick}>
            Set Bidding Room
          </Menu.Item>
          <Menu.Item key="5" onClick={handleClick}>
            Active Auctions
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Layout.Sider>
  );
};

export default SiderDashboard;
