import { TeamOutlined, UserOutlined, AccountBookOutlined, CloseOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";
import { Layout, Menu, Select } from 'antd';
import Router from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

const { Header, Content, Sider } = Layout;

import { companySelect, addCompanies } from '../../redux/company/companySlice';
import { incrementTab } from '../../redux/tabs/tabSlice';
import { useSelector, useDispatch } from 'react-redux';

const MainLayout = ({children}) => {

  const [load, setLoad] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [company, setCompany] = useState('');
  const tabs = useSelector((state) => state.tabs.value);

  const dispatch = useDispatch();
  useEffect(() => { getCompanies() }, [])

  async function getCompanies(){
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
    .then((x)=>{
      setLoad(false);
      dispatch(addCompanies(x.data.result))
      let tempState = [];
      x.data.result.forEach((x, index) => {
        tempState[index]={value:x.id, label:x.title}
      });
      setCompanies(tempState)
    });
  }

  function getParentItem(label, key, icon, children) {return { key, icon, children, label}}
  function getItem(label, key, icon, children, tab) {
    return { key, icon, children, label, onClick:()=>{
      if(!collapsed){dispatch(incrementTab(tab));}
    }};
  }

  const items = [
    getParentItem('Setup', '2', <SettingOutlined />,
      [
        getItem('Employees', '2-1',<></>, null, {
          label: `Employees`,
          key: '2-1',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Clients', '2-2',<></>, null, {
          label: `Clients`,
          key: '2-2',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Vendor', '2-5',<></>, null, {
          label: `Vendor`,
          key: '2-5',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Commodity', '2-3',<></>, null, {
          label: `Commodity`,
          key: '2-3',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Vessel', '2-4',<></>, null, {
          label: `Vessel`,
          key: '2-4',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Charges', '2-6',<></>, null, {
          label: `Charges`,
          key: '2-6',
          children: `Content of Tab Pane 2`,
        }),
      ]
    ),
    getParentItem('Accounts', '3', <AccountBookOutlined />,
      [
        getItem('Chart Of Account', '3-1',<></>, null, {
          label: `Chart Of Account`,
          key: '3-1',
          children: `Content of Tab Pane 2`,
        }),
      ]
    ),
    getParentItem('Sea Export', '4', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
      [
        getItem('SE Job', '4-1',<></>, null, {
          label: `SE Job`,
          key: '4-1',
          children: `Content of Tab Pane 2`,
        }),
      ]
    ),
  ];

  const itemsTwo = [
    getParentItem('Setup', '2', <SettingOutlined />),
    getParentItem('Accounts', '3', <AccountBookOutlined />),
    getParentItem('Sea Export', '4', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>),
  ];

  const handleChange = (value) => {
    Cookies.set('companyId', value, { expires: 1 });
    setCompany(value);
    dispatch(companySelect(value))
    Router.push('/')
  };

  const [toggleState, setToggleState] = useState(0);
  const [tabItems, setTabItems] = useState([]);

  const [tabActive, setTabActive] = useState({
    employee:false,
    clients:false,
    accounts:false,
    history:false,
    vendor:false,
    commodity:false,
    vessel:false,
    seJob:false,
    charges:false,
  });

  useEffect(()=>{alterTabs()}, [tabs])

  const alterTabs = () => {
    if(Object.keys(tabs).length>0){
      let tempTabs = [...tabItems];
      let cancel = false;
      tempTabs.forEach((x)=>{
        if(x.key==tabs.key){
          cancel = true;
        }
      })
      if(cancel==false){
        tempTabs.push({ key:tabs.key, label:tabs.label })
        let tempTabActive = {...tabActive};
        if(tabs.key=='2-1'){ tempTabActive.employee=true }
        else if(tabs.key=='2-2'){ tempTabActive.clients=true }
        else if(tabs.key=='2-3'){ tempTabActive.commodity=true }
        else if(tabs.key=='2-4'){ tempTabActive.vessel=true }
        else if(tabs.key=='2-5'){ tempTabActive.vendor=true }
        else if(tabs.key=='2-6'){ tempTabActive.charges=true }
        else if(tabs.key=='3-1'){ tempTabActive.accounts=true }
        else if(tabs.key=='4-1'){ tempTabActive.seJob=true }

        setTabItems(tempTabs);
        setTabActive(tempTabActive)
      }
    }
  };

  const toggleTab = (index) => {
    setToggleState(index);
    if(index=='2-1'){ Router.push('./employees') }
    else if(index=='2-2'){ Router.push('./client') }
    else if(index=='2-3'){ Router.push('./commodity') }
    else if(index=='2-4'){ Router.push('./vessel') }
    else if(index=='2-5'){ Router.push('./vendor') }
    else if(index=='2-6'){ Router.push('./charges') }
    else if(index=='3-1'){ Router.push('./accounts') }
    else if(index=='4-1'){ Router.push('./seJob') }
  };

  const removeTab = (index) => {
    let tempTabs = [...tabItems];
    tempTabs = tempTabs.filter((x)=>{
      return x.key!=index
    })
    setTabItems(tempTabs);
    if(toggleState==index){
      setToggleState(0)
    }
    if(tempTabs.length==0){
      Router.push('./')
    }
  };

  return (
    <Layout className="main-dashboard-layout">
      {(!load) && 
      <Sider trigger={null} collapsible collapsed={collapsed} style={{maxHeight:'100vh', overflowY:'auto'}}>
        <div className={!collapsed?'big-logo':'small-logo'} >
          <span>
            <img src={company=='1'?'/seanet-logo.png':company=='2'?'aircargo-logo.png':company=='3'?'cargolinkers-logo.png':null}/>
            <p>Dashboard</p>
          </span>
        </div>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={['1']} items={!collapsed?items:itemsTwo} />
      </Sider>
      }
      <Layout className="site-layout">
      <Header className="site-layout-background" style={{padding:0}}>
      {collapsed && <span className="menu-toggler"><AiOutlineRight onClick={() => setCollapsed(!collapsed)} /></span>}
      {!collapsed && <span className="menu-toggler"><AiOutlineLeft onClick={() => setCollapsed(!collapsed)} /></span>}
      <Select
        style={{
          width: 155, opacity:0.7
        }}
        onChange={handleChange}
        options={companies}
      />
      </Header>
      <Content className="site-layout-background"
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
        }}
      > 
      <div className='dashboard-styles'>
        <div className="bloc-tabs">
          {tabItems.map((x, index)=>{
            return(
              <div key={index} className={toggleState===x.key?"tabs active-tabs":"tabs"}>
                <button onClick={()=> toggleTab(x.key)}>
                  {x.label}
                </button>
                <span>
                  <CloseOutlined onClick={()=>removeTab(x.key)} className='clos-btn'/>
                </span>
              </div>
            )
          })}
        </div>
        <div className="content-tabs">
            {children}
        </div>
      </div>
      </Content>
      </Layout>
    </Layout>
  );
};
  
export default MainLayout;