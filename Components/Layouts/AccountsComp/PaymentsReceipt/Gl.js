import { Row, Col, Table, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { delay } from '../../../../functions/delay';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import openNotification from '../../../Shared/Notification';

const Gl = ({state, dispatch, selectedParty, payType, companyId}) => {

  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) =>  { return a.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}

  const getTotal = (type, list) => {
    let result = 0.00;
    list.forEach((x)=>{
      if(type==x.tran.type){
        result = result + x.tran.amount
      }
    })
    return result;
  }

  const handleSubmit = async() => {
    set("transLoad", true);
    let tempInvoices = [];
    let invoicesIds = [];
    state.invoices.forEach((x, i) => {
      if(x.receiving>0 && payType=="Recievable"){
        invoicesIds.push(x.invoice_No)
        tempInvoices.unshift({
          id:x.id,
          recieved:parseFloat(x.recieved) + parseFloat(x.receiving),
          status:parseFloat(x.recieved) + parseFloat(x.receiving)<x.inVbalance?"3":"2"
        })
      }else if(x.receiving>0 && payType!="Recievable"){
        invoicesIds.push(x.invoice_No)
        tempInvoices.unshift({
          id:x.id,
          paid:parseFloat(x.paid) + parseFloat(x.receiving),
          status:parseFloat(x.paid) + parseFloat(x.receiving)<x.inVbalance?"3":"2"
        })
      }
    });

    //await delay(1000);
    let voucher;
    voucher = {
      type:payType=="Recievable"?"Job Reciept":"Job Payment",
      vType:state.transaction=="Bank"? payType=="Recievable"?"BRV":"BPV" : payType=="Recievable"?"CRV":"CPV",
      CompanyId:companyId,
      amount:"",
      currency:"PKR",
      exRate:"1",
      chequeNo:state.checkNo,
      payTo:state.drawnAt,
      costCenter:"KHI",
      Voucher_Heads:[]
    }
    state.transactionCreation.forEach((x)=>{
      voucher.Voucher_Heads.push({
        amount:x.tran.amount,
        type:x.tran.type,
        narration:invoicesIds.toString(),
        VoucherId:null,
        ChildAccountId:x.particular.id
      })
    })
    console.log(state.transactionCreation)
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_INVOICE_TRANSACTION,tempInvoices).then(async(x)=>{
      // await getInvoices(selectedParty.id);
      // set("glVisible", false);
      // openNotification("Success", "Transaction Updated!", "green")
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher).then(async(y)=>{
        // await getInvoices(selectedParty.id);
        // set("glVisible", false);
        // openNotification("Success", "Transaction Updated!", "green")
        console.log(y.data)
      })
    })
    set("transLoad", false);
  }

  const getInvoices = async(id) => {
    set('load', true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, {headers:{id:id, pay:payType}}).then(async(x)=> {
        let temp = x.data.result;
        temp = temp.map(y=>({
            ...y,
            check:false,
            jobId:y.SE_Job==null?'Old Job':y.SE_Job.jobNo,
            jobSubType:y.SE_Job==null?'Old':y.SE_Job.subType,
            receiving:0.00,
            inVbalance:(parseFloat(y.total) + parseFloat(y.roundOff)).toFixed(2)//getNetInvoicesAmount(y.Charge_Heads).localAmount
        }));
        set('invoices', temp);
        set('load', false);
    })
  }

  return (
    <>
    <Modal title={`Transaction General Journal`} open={state.glVisible}
        onOk={()=>set('glVisible', false)}
        onCancel={()=>set('glVisible', false)}
        footer={false} maskClosable={false}
        width={'70%'}
    >
    <div style={{minHeight:260}}>
      <h3 className='grey-txt'>Proceed With Following Transaction Against?</h3>
      <div className='table-sm-1 mt-3' style={{maxHeight:260, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
          <thead>
              <tr>
                  <th className='' style={{width:260}}>Particular</th>
                  <th className='text-center' style={{width:25}}>Debit</th>
                  <th className='text-center' style={{width:25}}>Credit</th>
              </tr>
          </thead>
          <tbody>
          {state.transactionCreation.map((x, index) => {
          return (
              <tr key={index}>
                  <td>{x.particular.title}</td>
                  <td className='text-end'>{x.tran.type!="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
                  <td className='text-end'>{x.tran.type=="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
              </tr>
              )
          })}
            <tr>
                <td>Balance</td>
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('debit', state.transactionCreation))}</td>
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('credit', state.transactionCreation))}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
    {state.transactionCreation.length>0 && <button className='btn-custom' disabled={state.transLoad?true:false} onClick={handleSubmit}>
      {state.transLoad? <Spinner size='sm' className='mx-5' />:"Approve & Save"}
    </button>}
    </Modal>
    </>
  )
}

export default Gl;