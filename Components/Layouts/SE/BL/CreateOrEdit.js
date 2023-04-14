import React, { useEffect } from 'react';
import { Tabs } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '../../../Shared/Notification';
import BlInfo from './BlInfo';
import ContainerInfo from './ContainerInfo';
import BlDetail from './BlDetail';

const CreateOrEdit = ({state, dispatch, baseValues, companyId}) => {

  const {register, control, handleSubmit, reset, formState:{errors} } = useForm({
    defaultValues:state.values
  });

  useEffect(() => {
    if(state.edit){
      let tempState = {...state.selectedRecord};
      reset(tempState);
    }
    if(!state.edit){ reset(baseValues); }
  }, [state.selectedRecord])

  const onSubmit = async(data) => {
    console.log(data)
    console.log(state)
    //console.log(state.values)
  };

  const onEdit = async(data) => {
  };

  useEffect(() => {
    if(state.tabState!="5"){ dispatch({type:'toggle', fieldName:'selectedInvoice', payload:""}) }
  }, [state.tabState])

  const onError = (errors) => console.log(errors);

  return(
  <div className='client-styles' style={{overflowY:'auto', overflowX:'hidden'}}>
    <h6>{state.edit?'Edit':'Create'}</h6>
    <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
    <Tabs defaultActiveKey={state.tabState} activeKey={state.tabState}
     onChange={(e)=> dispatch({type:'toggle', fieldName:'tabState', payload:e}) }>
      <Tabs.TabPane tab="BL Info." key="1">
        <BlInfo control={control} register={register} state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} /> 
      </Tabs.TabPane>
      <Tabs.TabPane tab="Container Info" key="2">
        <ContainerInfo control={control} register={register} state={state} useWatch={useWatch} dispatch={dispatch} /> 
      </Tabs.TabPane>
      {state.shipperContent!="" &&<Tabs.TabPane tab="BL Detail" key="3">
        <BlDetail control={control} register={register} state={state} useWatch={useWatch} dispatch={dispatch} /> 
      </Tabs.TabPane >}
      <Tabs.TabPane tab="Ref No's / Stamps" key="4">
      </Tabs.TabPane>
    </Tabs>
    <button type="submit" disabled={state.load?true:false} className='btn-custom mt-3'>
      {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Save BL'}
    </button>
    </form>
  </div>
  )
}

export default CreateOrEdit