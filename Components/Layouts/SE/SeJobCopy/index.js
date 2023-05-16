import React, { useEffect, useReducer } from 'react';
import { recordsReducer, initialState, baseValues } from './states';
import CreateOrEdit from './CreateOrEdit';
import { useSelector, useDispatch } from 'react-redux';
import { appendValue } from '/redux/seJobValues/seJobValuesSlice';

const SeJob = ({fieldsData, jobData, id}) => {
  const companyId = useSelector((state) => state.company.value);
  const seJobValues = useSelector((state) => state.seJobValues.values);
  const tabs = useSelector((state) => state.tabs.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const dispatchRedux = useDispatch();
  
  useEffect(() => {
    dispatchRedux(appendValue({...seJobValues, hblDate:"123", hblIssue:"456", deliveryContent:'123'}))
    let tempChargeList = [];
    if(fieldsData){
      fieldsData.result.chargeList.forEach((x) => {
        tempChargeList.push({...x, label:`(${x.code}) ${x.short}`, value:x.code});
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