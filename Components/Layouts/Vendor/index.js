import { Row, Col, Table } from 'react-bootstrap';
import React, { useEffect, useReducer } from 'react';
import Router from 'next/router';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { EditOutlined, HistoryOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import History from '../../Shared/History';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
            visible: true,
        }
      }
      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            selectedRecord:{},
            edit: true,
            visible: true,
            selectedRecord:action.payload
        }
      }
      case 'modalOff': {
        let returnVal = { ...state, visible: false, edit: false, viewHistory:false };
        state.edit?returnVal.selectedRecord={}:null
        return returnVal
      }
      default: return state 
    }
}

const baseValues = {
  //Basic Info
  id:'',
  name:"",
  registerDate:"",
  person1:"",
  mobile1:"",
  person2:"",
  mobile2:"",
  telephone1:"",
  telephone2:"",
  address1:"",
  address2:"",
  city:"",
  zip:"",
  ntn:"",
  strn:"",
  website:"",
  infoMail:"",
  accountsMail:"",
  operations:[],
  types: [],
  companies:[1,2,3],
  //Bank Info
  bank:"",
  branchName:"",
  branchCode:"",
  accountNo:"",
  iban:"",
  swiftCode:"",
  routingNo:"",
  ifscCode:"",
  micrCode:"",
  bankAuthorizeDate:"",
  authorizedById : "",

  //Account Info
  accountRepresentatorId : "",
  currency:"",
}

const initialState = {
    records: [],
    load:false,
    visible:false,
    edit:false,
    viewHistory:false,
    values:baseValues,
    Representatives:[
      {name:'Accounts', records:[]},
      // {name:'Sales', records:[]},
      // {name:'Doc', records:[]}
    ],
    Operations:[
      { label: "Sea Import", value: "Sea Import" },
      { label: "Sea Export", value: "Sea Export" },
      { label: "Air Import", value: "Air Import" },
      { label: "Air Export", value: "Air Export" }
    ],
    Types:[
      { label: "Forwarder/Coloader", value: "Forwarder/Coloader" },
      { label: "Local Vendor", value: "Local Vendor" },
      { label: "Overseas Agent", value: "Overseas Agent" },
      { label: "Commission Agent", value: "Commission Agent" },
      { label: "Indentor", value: "Indentor" },
      { label: "Transporter", value: "Transporter" },
      { label: "CHA/CHB", value: "CHA/CHB" },
      { label: "Shipping Line", value: "Shipping Line" },
      { label: "Delivery Agent", value: "Delivery Agent" },
      { label: "Warehouse", value: "Warehouse" },
      { label: "Buying House", value: "Buying House" },
      { label: "Air Line", value: "Air Line" },
      { label: "Trucking", value: "Trucking" },
      { label: "Drayman", value: "Drayman" },
      { label: "Cartage", value: "Cartage" },
      { label: "Stevedore", value: "Stevedore" },
      { label: "Principal", value: "Principal" },
      { label: "Depot", value: "Depot" },
      { label: "Terminal", value: "Terminal" },
      { label: "Buyer", value: "Buyer" },
      { label: "Invoice Party", value: "Invoice Party" },
      { label: "Slot Operator", value: "Slot Operator" },
    ],
    companyList:[
      {id:1, name:''}
    ],
    editCompanyList:[
      {id:1, name:''}
    ],
    history:[],
    // Editing Records
    selectedRecord:{},
    oldRecord:{},
};

const Vendor = ({sessionData, representativeData, vendorData}) => {

  useEffect(()=>{ if(sessionData.isLoggedIn==false) Router.push('/login') }, [sessionData]);
  const companiesList = useSelector((state) => state.company.companies);

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records, visible, viewHistory } = state;

  useEffect(() => {
    dispatch({type:'toggle', fieldName:'companyList', payload:createCompanyList(companiesList)});
    dispatch({type:'toggle', fieldName:'editCompanyList', payload:createCompanyList(companiesList)});
    setRecords();
  }, [])

  const createCompanyList = (list) => {
    let tempState = [];
    list.forEach((x, index)=>{
          tempState.push({value:x.id, label:x.title, disabled:false})
    })
    return tempState
  }

  const setRecords = () => {
    let tempState = [ {name:'Accounts', records:[]}, {name:'Sales', records:[]}, {name:'Doc', records:[]} ];

    representativeData.result.Ar.forEach((x)=>{tempState[0].records.push(x)});
    representativeData.result.Dr.forEach((x)=>{tempState[1].records.push(x)});
    representativeData.result.Sr.forEach((x)=>{tempState[2].records.push(x)});
    
    dispatch({type:'toggle', fieldName:'Representatives', payload:tempState});
    dispatch({type:'toggle', fieldName:'records', payload:vendorData.result});
  }

  const getHistory = async(recordid,type) => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    dispatch({ type: 'history'})
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_HISTORY,{
      headers:{ recordid:recordid, type:type }
    }).then((x)=>{
      setTimeout(async() => {
        dispatch({type:'toggle', fieldName:'load', payload:false});
        dispatch({type:'toggle', fieldName:'history', payload:x.data.result});
    }, 2000);
    })
  }

  return (
    <div className='base-page-layout'>
    <Row>
        <Col><h5>Vendors</h5></Col>
        <Col><button className='btn-custom right' onClick={()=>dispatch({type:'create'})}>Create</button></Col>
    </Row>
    <hr className='my-2' />
    <Row style={{maxHeight:'69vh',overflowY:'auto', overflowX:'hidden'}}>
    <Col md={12}>
      <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Contact Persons</th>
            <th>Telephones</th>
            <th>Address</th>
            <th>History</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
        {
          records.map((x, index) => {
          return (
          <tr key={index} className='f'>
            <td>{x.name}</td>
            <td>{x.types.split(", ").map((z, i)=>{
              return(<div key={i} className="party-types">{z}</div>)
            })}</td>
            <td>
              {x.person1} {x.mobile1}<br/>
              {x.person2} {x.mobile2}<br/>
            </td>
            <td>
              {x.telephone1}<br/>
              {x.telephone2}
            </td>
            <td>
              {x.address1.slice(0,30)}<br/>
              {x.address2.slice(0,30)}<br/>
            </td>
            <td>
              Created By: <span className='blue-txt fw-5'>{x.createdBy}</span>
              <br/>
              <span className='' style={{position:'relative', top:2}}>Load History</span>
              <HistoryOutlined onClick={()=>getHistory(x.id,'vendor')} className='modify-edit mx-2' />
            </td>
            <td>
              <span>
                <EditOutlined className='modify-edit' onClick={()=>dispatch({type:'edit', payload:x})}/>
              </span>
            </td>
          </tr>
          )
        })}
        </tbody>
        </Table>
      </div>
    </Col>
    </Row>
    <Modal
      open={visible}
      onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
      width={1000} footer={false} centered={false}
    >
      {!viewHistory && <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} />}
      {viewHistory && <History history={state.history} load={state.load} />}
    </Modal>
    </div>
  )
}

export default Vendor