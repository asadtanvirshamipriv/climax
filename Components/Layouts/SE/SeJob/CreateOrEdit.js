import React, { useEffect } from 'react';
import { Tabs } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '../../../Shared/Notification';
import { SignupSchema } from './states';
import BookingInfo from './BookingInfo';
import EquipmentInfo from './EquipmentInfo';
import Routing from './Routing';
import Charges from './Charges/';
import Invoice from './Invoice';

const CreateOrEdit = ({state, dispatch, baseValues, companyId}) => {

  const {register, control, handleSubmit, reset, formState:{errors} } = useForm({
    resolver:yupResolver(SignupSchema), defaultValues:state.values
  });
  const subType = useWatch({control, name:"subType"});

  useEffect(() => {
    if(state.edit){
      let tempState = {...state.selectedRecord};
      tempState = { ...tempState,
        customCheck: tempState.customCheck.split(", "),
        transportCheck: tempState.transportCheck.split(", "),
        eta: tempState.eta==""?"":moment(tempState.eta),
        polDate: tempState.polDate==""?"":moment(tempState.polDate),
        podDate: tempState.podDate==""?"":moment(tempState.podDate),
        aesDate: tempState.aesDate==""?"":moment(tempState.aesDate),
        aesTime: tempState.aesTime==""?"":moment(tempState.aesTime),
        eRcDate: tempState.eRcDate==""?"":moment(tempState.eRcDate),
        eRcTime: tempState.eRcTime==""?"":moment(tempState.eRcTime),
        eRlDate: tempState.eRlDate==""?"":moment(tempState.eRlDate),
        eRlTime: tempState.eRlTime==""?"":moment(tempState.eRlTime),
        jobDate: tempState.jobDate==""?"":moment(tempState.jobDate),
        shipDate:tempState.shipDate==""?"":moment(tempState.shipDate),
        doorMove:tempState.doorMove==""?"":moment(tempState.doorMove),
        cutOffDate:tempState.cutOffDate==""?"":moment(tempState.cutOffDate),
        cutOffTime:tempState.cutOffTime==""?"":moment(tempState.cutOffTime),
        siCutOffDate:tempState.siCutOffDate==""?"":moment(tempState.siCutOffDate),
        siCutOffTime:tempState.siCutOffTime==""?"":moment(tempState.siCutOffTime),
        vgmCutOffDate:tempState.vgmCutOffDate==""?"":moment(tempState.vgmCutOffDate),
        vgmCutOffTime:tempState.vgmCutOffTime==""?"":moment(tempState.vgmCutOffTime)
      }
      if(tempState.SE_Equipments.length>0){
        let tempEquips = tempState.SE_Equipments;
        tempEquips.push({id:'', size:'', qty:'', dg:tempState.dg=="Mix"?"DG":tempState.dg, gross:'', teu:''})
        dispatch({type:'toggle', fieldName:'equipments', payload:tempState.SE_Equipments});
      }else{
        dispatch({type:'toggle', fieldName:'equipments', payload:[{id:'', size:'', qty:'', dg:tempState.dg=="Mix"?"DG":tempState.dg, gross:'', teu:''}]});
      }
      dispatch({type:'toggle', fieldName:'oldRecord', payload:tempState});
      reset(tempState);
    }
    if(!state.edit){ reset(baseValues) }
  }, [state.selectedRecord])

  const onSubmit = async(data) => {
    data.equipments = state.equipments
    data.customAgentId = data.customCheck.length>0?data.customAgentId:null;
    data.transporterId = data.transportCheck.length>0?data.transporterId:null;

    data.ClientId = data.ClientId!=""?data.ClientId:null;
    data.shipperId = data.shipperId!=""?data.shipperId:null;
    data.consigneeId = data.consigneeId!=""?data.consigneeId:null;
    data.overseasAgentId = data.overseasAgentId!=""?data.overseasAgentId:null;
    data.salesRepresentatorId = data.salesRepresentatorId!=""?data.salesRepresentatorId:null;
    data.forwarderId = data.forwarderId!=""?data.forwarderId:null;
    data.localVendorId = data.localVendorId!=""?data.localVendorId:null;
    data.commodityId = data.commodityId!=""?data.commodityId:null;
    data.companyId = companyId

    let loginId = Cookies.get('loginId');
    data.createdById = loginId;
    dispatch({type:'toggle', fieldName:'load', payload:true});
    setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_SEAJOB,{
            data
        }).then((x)=>{
            if(x.data.status=='success'){
                let tempRecords = [...state.records];
                tempRecords.unshift(x.data.result);
                dispatch({type:'toggle', fieldName:'records', payload:tempRecords});
                dispatch({type:'modalOff'});
                reset(baseValues)
                openNotification('Success', `Job Created!`, 'green')
            }else{
                openNotification('Error', `An Error occured Please Try Again!`, 'red')
            }
            dispatch({type:'toggle', fieldName:'load', payload:false});
        })
    }, 3000);
  };

  const onEdit = async(data) => {
    data.equipments = state.equipments;
    data.customAgentId = data.customCheck.length>0?data.customAgentId:null;
    data.transporterId = data.transportCheck.length>0?data.transporterId:null;
    data.companyId = companyId
    dispatch({type:'toggle', fieldName:'load', payload:true});
    setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_SEAJOB,{data}).then((x)=>{
            if(x.data.status=='success'){
                let tempRecords = [...state.records];
                let i = tempRecords.findIndex((y=>data.id==y.id));
                tempRecords[i] = x.data.result;
                dispatch({type:'toggle', fieldName:'records', payload:tempRecords});
                dispatch({type:'modalOff'});
                reset(baseValues)
                openNotification('Success', `Job Updated!`, 'green')
            }else{
                openNotification('Error', `An Error occured Please Try Again!`, 'red')
            }
            dispatch({type:'toggle', fieldName:'load', payload:false});
        })
    }, 3000);
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
      <Tabs.TabPane tab="Booking Info" key="1">
        <BookingInfo control={control} register={register} errors={errors} state={state} useWatch={useWatch} dispatch={dispatch} />
      </Tabs.TabPane>
      {subType=="FCL" &&
      <Tabs.TabPane tab="Equipment" key="2">
        <EquipmentInfo control={control} register={register} errors={errors} state={state} dispatch={dispatch} useWatch={useWatch} />
      </Tabs.TabPane>
      }
      <Tabs.TabPane tab="Routing" key="3">
        <Routing control={control} register={register} errors={errors} state={state} useWatch={useWatch} />
      </Tabs.TabPane >
      {state.edit &&
      <Tabs.TabPane tab="Charges" key="4">
        <Charges state={state} dispatch={dispatch} />
      </Tabs.TabPane>
      }
      {(state.edit && state.selectedInvoice!='') &&
      <Tabs.TabPane tab="Invoice / Bills" key="5">
        <Invoice state={state} dispatch={dispatch} companyId={companyId} />
      </Tabs.TabPane>
      }
      {/* {state.edit &&
      <Tabs.TabPane tab="Bill of Lading" key="6">
        <BL state={state} dispatch={dispatch} />
      </Tabs.TabPane>
      } */}
    </Tabs>
      {(state.tabState!="4" && state.tabState!="5" && state.tabState!="6") &&
      <>
      <button type="submit" disabled={state.load?true:false} className='btn-custom mt-3'>
        {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Save Job'}
      </button>
      </>
      }
    </form>
  </div>
  )
}

export default CreateOrEdit