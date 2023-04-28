import React, { useEffect } from 'react';
import { Tabs } from "antd";
import { setAndFetchBlData } from "./states";
import { useForm, useWatch } from "react-hook-form";
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '../../../Shared/Notification';
import BlInfo from './BlInfo';
import ContainerInfo from './ContainerInfo';
import BlDetail from './BlDetail';
import Stamps from './Stamps';

const CreateOrEdit = ({state, dispatch, baseValues, companyId}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b})
  const {register, control, handleSubmit, reset, formState:{errors} } = useForm({
    defaultValues:state.values
  });
  const allValues = useWatch({control})
  useEffect(() => {
    if(state.edit){
      setAndFetchBlData(reset, state, allValues, set, dispatch);
    }
    if(!state.edit){ reset(baseValues); }
  }, [state.selectedRecord])

  const onSubmit = async(data) => {
    set("load", true)
    let tempData = {
      ...data,
      mblDate:data.mblDate,
      issueDate:data.issueDate,
      hblDate:data.hblDate,
      shipperContent:state.shipperContent,
      consigneeContent:state.consigneeContent,
      notifyOneContent:state.notifyOneContent,
      notifyTwoContent:state.notifyTwoContent,
      deliveryContent:state.deliveryContent,
      marksContent:state.marksContent,
      noOfPckgs:state.noOfPckgs,
      descOfGoodsContent:state.descOfGoodsContent,
      grossWeightContent:state.grossWeightContent,
      measurementContent:state.measurementContent,
      Container_Infos:state.Container_Infos,
      deletingContinersList:state.deletingContinersList
    };
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_BL, tempData)
    .then((x)=>{
      set("load", false);
      openNotification("Success","BL Created Successfully", "green")
    })
  };

  const onEdit = async(data) => {
    set("load", true)
    let tempData = {
      ...data,
      mblDate:data.mblDate,
      issueDate:data.issueDate,
      hblDate:data.hblDate,
      shipperContent:state.shipperContent,
      consigneeContent:state.consigneeContent,
      notifyOneContent:state.notifyOneContent,
      notifyTwoContent:state.notifyTwoContent,
      deliveryContent:state.deliveryContent,
      marksContent:state.marksContent,
      noOfPckgs:state.noOfPckgs,
      descOfGoodsContent:state.descOfGoodsContent,
      grossWeightContent:state.grossWeightContent,
      measurementContent:state.measurementContent,
      Container_Infos:state.Container_Infos,
      deletingContinersList:state.deletingContinersList
    };
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_BL, tempData)
    .then((x)=>{
      set("load", false);
      openNotification("Success","BL Edited Successfully", "green")
    })
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
        <ContainerInfo control={control} register={register} state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} /> 
      </Tabs.TabPane>
      <Tabs.TabPane tab="BL Detail" key="3">
        <BlDetail control={control} register={register} state={state} useWatch={useWatch} dispatch={dispatch} /> 
      </Tabs.TabPane >
      <Tabs.TabPane tab="Ref No's / Stamps" key="4">
        <Stamps state={state} control={control} useWatch={useWatch} />
      </Tabs.TabPane>
    </Tabs>
    {allValues.jobNo && 
    <button type="submit" disabled={state.load?true:false} className='btn-custom mt-3'>
      {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Save BL'}
    </button>
    }
    </form>
  </div>
  )
}

export default CreateOrEdit