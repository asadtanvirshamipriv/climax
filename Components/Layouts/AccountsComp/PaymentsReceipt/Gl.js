import { Row, Col, Table, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { delay } from '../../../../functions/delay';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import openNotification from '../../../Shared/Notification';
import { getAccounts } from './states';

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
    //console.log(state.transactionCreation);
    set("transLoad", true);
    let tempInvoices = [];

    // state.invoices.forEach((x, i) => {
    //   if(x.receiving>0 && payType=="Recievable"){
    //     tempInvoices.unshift({
    //       id:x.id,
    //       recieved:parseFloat(x.recieved) + parseFloat(x.receiving),
    //       status:parseFloat(x.recieved) + parseFloat(x.receiving)<x.inVbalance?"3":"2"
    //     })
    //     if(x.inVbalance-x.receiving<1 && x.inVbalance-x.receiving>0){
    //       tempInvoices[0].status=2
    //       //console.log(x.invoice_No, x.inVbalance-x.receiving);
    //     }
    //   }else if(x.receiving>0 && payType!="Recievable"){
    //     tempInvoices.unshift({
    //       id:x.id,
    //       paid:parseFloat(x.paid) + parseFloat(x.receiving),
    //       status:parseFloat(x.paid) + parseFloat(x.receiving)<x.inVbalance?"3":"2"
    //     })
    //     if(x.inVbalance-x.receiving<1 && x.inVbalance-x.receiving>0){
    //       tempInvoices[0].status=2
    //       //console.log(x.invoice_No, x.inVbalance-x.receiving);
    //     }
    //   }
    // })

    //console.log(tempInvoices) FCL FREIGHT INCOME
    //let leftoverAmount = await getAccounts(payType=="Recievable"?'Selling Expense':'Income', companyId);
    //console.log(leftoverAmount)

    // await delay(1000);
    // await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_INVOICE_TRANSACTION,tempInvoices).then(async(x)=>{
    //   console.log(x.data);
    //   await getInvoices(selectedParty.id);
    //   set("glVisible", false);
    //   openNotification("Success", "Transaction Updated!", "green")
    //   tempInvoices = [];
    // })
    set("transLoad", false);
  }

  const getInvoices = async(id) => {
    set('load', true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, {headers:{id:id, pay:payType}}).then(async(x)=> {
        console.log(x.data.result);
        let temp = x.data.result;
        temp = temp.map(y=>({
            ...y,
            check:false,
            receiving:0.00,
            inVbalance:getNetInvoicesAmount(y.Charge_Heads).localAmount
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
      <h4>Basic Account Activity</h4>

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
      <h4>Advanced Account Activity</h4>
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
          {state.activityCreation.map((x, index) => {
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
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('debit', state.activityCreation))}</td>
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('credit', state.activityCreation))}</td>
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