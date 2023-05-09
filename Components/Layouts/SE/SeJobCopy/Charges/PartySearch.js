import {Row, Col, Table} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, Switch } from 'antd';
import {CheckCircleOutlined} from "@ant-design/icons"

const PartySearch = ({state, dispatch}) => {

  const [partyType, setPartyType] = useState('vendor');

    const getClients = async() => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
      .then((x) => {
          dispatch({type:'toggle', fieldName:'clientParties', payload:x.data.result});
      })
    }

    const getVendors = async() => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS)
      .then((x) => {
          let data = [];
          x.data.result.forEach(x => {
            data.push({...x, check:false})
          });
          dispatch({type:'toggle', fieldName:'vendorParties', payload:data});
      })
    }

    useEffect(() => { getClients(); getVendors();}, [])

    const RenderData = (props) => {
      return(
        <>
        {props.data.map((x, i)=> {
          return(
          <tr key={i} className={`${x.check?"table-select-list-selected":"table-select-list"}`}
            onClick={()=>{

              if(!x.check){

                let temp = props.type=="vendors"?[...state.vendorParties]:[...state.clientParties];
                temp.forEach((y, i2)=>{
                  if(y.id==x.id){ temp[i2].check=true
                  } else { temp[i2].check=false }
                })
                dispatch({type:'toggle', fieldName:props.type=="vendors"?'vendorParties':'clientParties', payload:temp});

              } else {

                let temp = [];
                if(state.chargesTab=='1'){
                  temp = [...state.reciveableCharges];
                  temp[state.headIndex].invoiceType = x.types.includes("Overseas Agent")?"Agent Bill":"Job Invoice" ;
                }else{
                  temp = [...state.paybleCharges];
                  temp[state.headIndex].invoiceType = x.types.includes("Overseas Agent")?"Agent Invoice":"Job Bill" ;
                }

                temp[state.headIndex].name = x.name;
                temp[state.headIndex].partyId = x.id;
                temp[state.headIndex].partyType = partyType;
                dispatch({type:'toggle', fieldName:'headIndex', payload:""});
                dispatch({type:'toggle', fieldName:'headVisible', payload:false});
                let tempOne = [...state.vendorParties];
                let tempTwo = [...state.clientParties];

                tempOne.forEach((y, i1)=>{
                  tempOne[i1].check=false
                })
                tempTwo.forEach((y, i1)=>{
                  tempTwo[i1].check=false
                })

                dispatch({type:'toggle', fieldName:'vendorParties', payload:tempOne});
                dispatch({type:'toggle', fieldName:'clientParties', payload:tempTwo});

              }
            }}
          >
            <td className='pt-1 text-center px-3'> {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 } </td>
            <td className='pt-1 text-center' style={{whiteSpace:"nowrap"}}><strong>{x.name}</strong></td>
            <td className='pt-1 text-center'>
              {x.types.split(", ").map((y, i2)=>{
                return(
                  <Tag key={i2} color="purple" className='mb-1'>{y}</Tag>
                )
              })}
            </td>
            <td className='pt-1 text-center'>{x.city}</td>
            <td className='pt-1 text-center'>
              <Tag color="geekblue" className='mb-1'>{x.person1}</Tag>
              <br/> 
              <Tag color="geekblue">{x.person2}</Tag>
            </td>
            <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.mobile1}</Tag><br/> <Tag color="cyan">{x.mobile2}</Tag></td>
            <td className='pt-1 text-center fs-12 grey-txt'>{x.address1} {x.address2!=""?<>, <br/>{x.address2}</>:<></>} </td>
          </tr>
          )
        })}
        </>
      )
    }

  return(
    <>
    <h5>Party Selection</h5>
    <hr/>
    <Switch checked={partyType!="vendor"}
      onChange={() => {
        partyType=="vendor"?setPartyType("client"):setPartyType("vendor")
      }}
    />
    <div className='table-sm-1 mt-4' style={{maxHeight:300, overflowY:'auto'}}>
      <Table className='tableFixHead'>
      <thead>
        <tr>
          <th className='text-center'>#</th>
          <th className='text-center'>Name</th>
          <th className='text-center'>Types</th>
          <th className='text-center'>City</th>
          <th className='text-center'>Contact Persons</th>
          <th className='text-center'>Mobile</th>
          <th className='text-center'>Address</th>
        </tr>
      </thead>
      <tbody>
      <RenderData data={partyType=="vendor"?state.vendorParties:state.clientParties} type={partyType=="vendor"?'vendors':'clients'} />
      </tbody>
      </Table>
    </div>
    <div>
    </div>
    </>
  )
}

export default PartySearch