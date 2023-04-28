import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { recordsReducer, initialState, baseValues } from './states';
import CreateOrEdit from './CreateOrEdit';
import moment from 'moment';

const SeJob = ({partiesData, BlsData}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
  const companyId = useSelector((state) => state.company.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { visible } = state;

  useEffect(() => {
    set('partiesData',partiesData)
    set('records',BlsData)
  }, [])

  return (
  <>
    {companyId!='' &&
    <div className='base-page-layout'>
      <Row>
        <Col><h5>Sea Export Job</h5></Col>
        <Col>
          <button className='btn-custom right' onClick={()=>dispatch({type:'create'})}>
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
            <th>Job #</th>
            <th>MBL #</th>
            <th>HBL #</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
        {
        state.records.map((x, index) => {
        return (
        <tr key={index} className='f row-hov' onClick={()=>dispatch({type:'edit', payload:x})} >
          <td>{index + 1}</td>
          <td>{x.SE_Job.jobNo}</td>
          <td>{x.mbl}</td>
          <td>{x.hbl}</td>
          <td>{x.status}</td>
          <td>{moment(x.createdAt).format("DD-MM-YYYY")}</td>
        </tr>
          )
        })}
        </tbody>
        </Table>
      </div>
      <Modal
        open={visible} maskClosable={false}
        onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
        width={1000} footer={false} centered={true}
      >
        <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} companyId={companyId} />
      </Modal>
      </div>
    }
  </>
  )
}

export default SeJob;