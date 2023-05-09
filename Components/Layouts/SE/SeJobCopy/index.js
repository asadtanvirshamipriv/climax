import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { recordsReducer, initialState, baseValues } from './states';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';

const SeJob = ({fieldsData, jobData, id}) => {
  const companyId = useSelector((state) => state.company.value);
  const tabs = useSelector((state) => state.tabs.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    let tempChargeList = [];
    if(fieldsData){
      fieldsData.result.chargeList.forEach((x) => {
        tempChargeList.push({...x, label:x.code, value:x.code});
      });
      fieldsData.result.chargeList=tempChargeList;
      dispatch({type:'set', 
        payload:{
          fields:fieldsData.result,
          selectedRecord:jobData,
          fetched:true,
          edit:id=="new"?false:true
        }
      })
    }
  }, [])

  return (
  <>
    <div className='base-page-layout'>
     {state.fetched && <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} companyId={companyId} jobData={jobData} /> }
    </div>
  </>
  )
}

export default SeJob;