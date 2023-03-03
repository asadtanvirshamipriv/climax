import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import openNotification from '../../../Shared/Notification';
import { Empty, InputNumber, Checkbox, Radio } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import { recordsReducer, initialState, getAccounts, totalRecieveCalc } from './states';
import { useSelector } from 'react-redux';
import moment from "moment";

import TransactionInfo from './TransactionInfo';
import AccountSelection from './AccountSelection';
import Gl from './Gl';

const BillComp = ({selectedParty, payType}) => {

    const companyId = useSelector((state) => state.company.value);
    const set = (a, b) => dispatch({type:'set', var:a, pay:b});

    const [ state, dispatch ] = useReducer(recordsReducer, initialState);

    useEffect(() => { getInvoices(selectedParty.id); }, [selectedParty, payType]);
    useEffect(() => { {set('totalrecieving', totalRecieveCalc(state.invoices));} }, [state.invoices]);
    useEffect(() => { {
        if(state.isPerc){
            let tax = (state.totalrecieving/100)*state.taxPerc;
            set('finalTax', tax);
        }else{
            set('finalTax', state.taxAmount);
        }
    } }, [state.totalrecieving, state.taxPerc, state.taxAmount]);

    const getInvoices = async(id) => {
        set('load', true);
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, {headers:{id:id, pay:payType}}).then(async(x)=> {
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

    const resetAll = () => {
        let tempList = [...state.invoices];

        tempList = tempList.map(x=>({
            ...x,
            check:false,
            receiving:0.00,
        }));

        return tempList
    }

    const autoKnocking = async() => {
        let val = resetAll()
        if(state.auto=='0'||state.auto==null){
            openNotification('Alert', 'Please Enter A Number', 'orange');
        } else {
            let tempAmount = (parseFloat(state.auto) * parseFloat(state.exRate)).toFixed(2);
            let pendingFund = 0;
            val.forEach((x) => {
                pendingFund = parseFloat((parseFloat(x.inVbalance) - parseFloat(x.receiving==null?0:x.receiving)).toFixed(2));
                if(pendingFund > tempAmount){
                    x.receiving = (parseFloat(x.receiving) + parseFloat(tempAmount)).toFixed(2);
                    tempAmount = 0.00;
                } else if (tempAmount==0.00){
                    null
                } else if (pendingFund < tempAmount){
                    x.receiving = pendingFund;
                    tempAmount = tempAmount - pendingFund
                }
                pendingFund = 0.00;
            })
            set('invoices', val);
        }
    }

    const submitPrices = () => {
        // console.log(payType);
        // console.log(moment(state.date).format("DD-MM-YYYY"));
        // console.log(state.transaction);
        // state.transaction=="Bank"?console.log(state.checkNo):null;
        // console.log(state.payAccountRecord);
        // console.log(state.taxAccountRecord.title);
        // console.log(state.bankChargesAccountRecord.title);
        // console.log(state.drawnAt);
        // console.log(state.bankCharges);
        // console.log(state.totalrecieving);
        // console.log(state.invoices);

        let transaction = {
            date:`${moment(state.date).format("DD-MM-YYYY")}`,
            transaction:`On a/c of ${state.onAccount}`,
            drawn:`${state.drawnAt}`,
            recievable:{
                exists: ((Object.keys(state.payAccountRecord).length==0) || (state.totalrecieving==0))?false:true,
                credit:selectedParty,
                debit:state.payAccountRecord,
                amount:state.totalrecieving
            },
            salesTax:{
                exists:((Object.keys(state.taxAccountRecord).length==0) || (state.finalTax==0))?false:true,
                credit:state.payAccountRecord,
                debit:state.taxAccountRecord,
                amount:state.finalTax
            },
            bankCharges:{
                exists:((Object.keys(state.bankChargesAccountRecord).length==0) || (state.bankCharges==0))?false:true,
                credit:state.payAccountRecord,
                debit:state.bankChargesAccountRecord,
                amount:state.bankCharges
            },
        }
        set('transactionCreation', transaction);
        set('glVisible', true);
    }

  return (
    <>
    <div>
        <Row>
            <Col md={7}>
                <TransactionInfo state={state} dispatch={dispatch} payType={payType} />
            </Col>
            <Col md={5} className="">
                <div className="mb-2 " 
                    onClick={()=>{
                        set('autoOn', !state.autoOn);
                        set('invoices', resetAll());
                        set('auto', '0');
                        set('exRate', '1');
                    }} 
                    style={{cursor:'pointer', borderBottom:'1px solid silver', paddingBottom:2}}
                >
                    <span><Checkbox checked={state.autoOn} style={{position:'relative', bottom:1}} /></span>
                    <span className='mx-2'>Auto Knock Off</span>
                </div>
                <Row>
                    <Col md={5}>
                        <span className='grey-txt'>Amount</span>
                        <InputNumber 
                            size='small'
                            min="0" stringMode 
                            style={{width:'100%', paddingRight:10}} 
                            disabled={!state.autoOn} value={state.auto} 
                            onChange={(e)=>set('auto', e)} 
                        />
                    </Col>
                    <Col md={4}>
                        <span className='grey-txt'>Ex. Rate</span>
                        <InputNumber size='small'
                            min="1.00" stringMode 
                            style={{width:'100%', paddingRight:20}} 
                            disabled={!state.autoOn} value={state.exRate} 
                            onChange={(e)=>set('exRate', e)} 
                        />
                    </Col>
                    <Col md={3}>
                        <br/>
                        <button className={state.autoOn?'btn-custom':'btn-custom-disabled'} 
                            style={{fontSize:10}}
                            disabled={!state.autoOn}
                            onClick={autoKnocking}
                        >Set</button>
                    </Col>
                    <Col md={3} className="mt-3">
                        <div className='grey-txt fs-14'>Tax Amount</div>
                        <InputNumber size='small'  value={state.taxAmount} disabled={state.isPerc?true:false} onChange={(e)=>set('taxAmount',e)} min="0.0" max="100.00" />
                    </Col>
                    <Col md={1} className="mt-3">
                        <div className='grey-txt mb-1 fs-14'>%</div>
                        <Checkbox size='small'  checked={state.isPerc} 
                            onChange={()=>{  
                                set('taxAmount',0.0);
                                set('taxPerc',0.0);
                                set('isPerc',!state.isPerc);
                            }} 
                        />
                    </Col>
                    <Col md={3} className="mt-3">
                        <div className='grey-txt fs-14'>Tax %</div>
                        <InputNumber size='small'  value={state.taxPerc} disabled={!state.isPerc?true:false} onChange={(e)=>set('taxPerc',e)} min="0.0" />
                    </Col>
                    <Col className="mt-3" md={5}>
                        <div className="grey-txt fs-14">Tax Account #</div>
                        <div className="custom-select-input-small" 
                            onClick={async()=>{
                                set('variable', 'taxAccountRecord');
                                set('visible', true);

                                let resutlVal = await getAccounts('Adjust', companyId);
                                set('accounts', resutlVal);
                            }}
                        >{
                            Object.keys(state.taxAccountRecord).length==0?
                            <span style={{color:'silver'}}>Select Account</span>:
                            <span style={{color:'black'}}>{state.taxAccountRecord.title}</span>
                        }
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
    {!state.load && 
    <>
        {state.invoices.length==0 && <Empty/>}
        {state.invoices.length>0 &&
        <div>
        <div style={{minHeight:250}}>
            <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
            <Table className='tableFixHead' bordered>
                <thead>
                    <tr className='fs-12'>
                    <th>Sr.</th>
                    <th>Job #</th>
                    <th>Inv/Bill #</th>
                    <th>HBL</th>
                    <th>MBL</th>
                    <th>Currency</th>
                    <th>{payType=="Recievable"? 'Inv':'Bill Amount'} Bal</th>
                    <th>{payType=="Recievable"? 'Receiving Amount':'Paying Amount'}</th>
                    <th>Balance</th>
                    <th>Select</th>
                    <th>Container</th>
                    </tr>
                </thead>
                <tbody>
                {state.invoices.map((x, index) => {
                    return (
                        <tr key={index} className='f fs-12'>
                            <td style={{width:30}}>{index + 1}</td>
                            <td style={{width:100}}>{x.SE_Job.jobNo}</td>
                            <td style={{width:100}}>{x.invoice_No}</td>
                            <td>HBL</td>
                            <td>MBL</td>
                            <td style={{width:100}}>PKR</td>
                            <td>{x.inVbalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
                            <td style={{padding:3, width:150}}>
                                <InputNumber style={{height:30, width:140}} value={x.receiving} min="0" max={`${x.inVbalance}`} stringMode  disabled={state.autoOn}
                                    onChange={(e)=>{
                                        let tempState = [...state.invoices];
                                        tempState[index].receiving = e;
                                        set('invoices', tempState);
                                    }}
                                />
                            </td>
                            <td>
                                {( parseFloat(x.inVbalance)-parseFloat(x.recieved==null?0:x.recieved)-parseFloat(x.receiving==null?0:x.receiving)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }
                            </td>
                            <td style={{ width:50}} className='px-3 py-2'>
                                <input type='checkbox' style={{cursor:'pointer'}} checked={x.check} disabled={state.autoOn}
                                    onChange={()=>{
                                        let tempState = [...state.invoices];
                                        tempState[index].check = !tempState[index].check;
                                        tempState[index].receiving = tempState[index].check?x.inVbalance:0.00
                                        set('invoices', tempState);
                                    }}
                                />
                            </td>
                            <td></td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            </div>
        </div>
            <div className=''>
                Total Receiving Amount:{" "}
                <div style={{padding:3, border:'1px solid silver', minWidth:100, display:'inline-block', textAlign:'right'}}>
                    {state.totalrecieving.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
                </div>
            </div>
            <div className='text-end'>
                <button onClick={submitPrices}  className='btn-custom'>Save</button>
            </div>
        </div>
        }
    </>
    }
    {state.load && <div className='text-center' ><Spinner /></div>}
    {state.glVisible && <Gl state={state} dispatch={dispatch} />}
    </>
  )
}

export default BillComp