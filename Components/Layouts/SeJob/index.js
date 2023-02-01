import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { recordsReducer, initialState, baseValues } from './states';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { EditOutlined } from '@ant-design/icons';

const SeJob = ({fieldsData, jobsData}) => {
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { visible, viewHistory } = state;

  useEffect(() => {
    let tempChargeList = [];
    fieldsData.result.chargeList.forEach((x) => {
      tempChargeList.push({...x, label:x.code, value:x.code});
    });
    fieldsData.result.chargeList=tempChargeList
    dispatch({type:'toggle', fieldName:'fields', payload:fieldsData.result})
    dispatch({type:'toggle', fieldName:'records', payload:jobsData.result})
  }, [])

  const getVessel = (id) => {
    let name = "";
    fieldsData.result.vessel.forEach((x) => {
      if(x.id==id){ name= x.name }
    })
    return name
  }

  return (
  <div className='base-page-layout'>
    <Row>
      <Col><h5>Sea Export Job</h5></Col>
      <Col><button className='btn-custom right' onClick={()=>dispatch({type:'create'})}>Create</button></Col>
    </Row>
    <hr className='my-2' />
    <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Basic Info</th>
          <th>Shipment Info</th>
          <th>Company Info</th>
          <th>Container Info</th>
          <th>Other Info</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
      {
      state.records.map((x, index) => {
      return (
      <tr key={index} className='f'>
        <td>{index + 1}</td>
        <td>
          <span className='blue-txt fw-5'>{x.Client.name}</span>
          <br/>Nomination: {x.nomination}
          <br/>Freight Type: {x.freightType}
        </td>
        <td>Vessel: {getVessel(x.vessel)}<br/>POL: {x.pol}<br/>POD: {x.pod}</td>
        <td>Cost Center: <span className='blue-txt fw-5'>{x.costCenter}</span></td>
        <td>
          Container No. {x.container}<br/>
          Weight: {x.weight}
        </td>
        <td>
          Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span>
          <br/>
          Custom Clearance: <span className='blue-txt fw-5'>{x.customCheck!=''?'Yes':'No'}</span>
        </td>
        <td>
          <span>
            <EditOutlined className='modify-edit' onClick={()=>{
              dispatch({type:'edit', payload:x})
            }} />
          </span>
        </td>
      </tr>
        )
      })}
      </tbody>
      </Table>
    </div>
    <Modal
      open={visible}
      onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
      width={1000} footer={false} centered={true}
    >
      {!viewHistory && <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} />}
    </Modal>
  </div>
  )
}

export default SeJob;