import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';

const SEJobList = ({jobsData, fieldsData}) => {
  const companyId = useSelector((state) => state.company.value);
  const tabs = useSelector((state) => state.tabs.value);
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setRecords(jobsData.result);
  }, [])

  return (
  <>
    {companyId!='' &&
    <div className='base-page-layout'>
      <Row>
        <Col><h5>Sea Export Job</h5></Col>
        <Col>
          <button className='btn-custom right'
            //onClick={()=>dispatch({type:'create'})}
            onClick={()=>{
              dispatch(incrementTab({"label":"SE JOB","key":"4-3","id":"new"}))
              Router.push(`/seJob/new`)
            }}
          >
            Create
          </button>
        </Col>
      </Row>
      <hr className='my-2' />
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Basic Info</th>
            <th>Shipment Info</th>
            <th>Container Info</th>
            <th>Other Info</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
        records.map((x, index) => {
        return (
        <tr key={index} className='f row-hov'
          //onClick={()=>dispatch({type:'edit', payload:x})}
          onClick={()=>{
            dispatch(incrementTab({
              "label": "SE JOB",
              "key": "4-3",
              "id":x.id
            }))
            Router.push(`/seJob/${x.id}`)
          }}
        >
          <td>{index + 1}</td>
          <td>
            <span className='blue-txt fw-7'>{x.jobNo}</span>
            <br/>Nomination: <span className='grey-txt'>{x.nomination}</span>
            <br/>Freight Type: <span className='grey-txt'>{x.freightType}</span>
          </td>
          <td>
            {/* Vessel: <span className='grey-txt'>{x.vessel}</span><br/> */}
            POL: <span className='grey-txt'>{x.pol}</span><br/>
            POD: <span className='grey-txt'>{x.pod}</span><br/>
            FLD: <span className='grey-txt'> {x.fd}</span>
          </td>
          <td>
            Container: <span className='grey-txt'>{x.container}</span><br/>
            Weight: <span className='grey-txt'>{x.weight}</span>
          </td>
          <td>
            Party:<span className='blue-txt fw-5'> {x.Client===null?"":x.Client.name}</span><br/>
            Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span>
            <br/>
            Custom Clearance: <span className='blue-txt fw-5'>{x.customCheck!=''?'Yes':'No'}</span>
          </td>
          <td>
            {x.approved=="true"?<img src={'approve.png'} height={70} className='' />:"Not Approved"}
          </td>
        </tr>
          )
        })}
        </tbody>
        </Table>
      </div>
      </div>
    }
  </>
  )
}

export default SEJobList;