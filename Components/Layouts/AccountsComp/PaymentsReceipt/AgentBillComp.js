import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import { recordsReducer, initialState, getAccounts } from './states';
import openNotification from '../../../Shared/Notification';
import { Empty, InputNumber, Checkbox, Radio } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import AgentTransactionInfo from './AgentTransactionInfo';
import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AgentBillComp = ({selectedParty, payType, invoiceCurrency}) => {

    const companyId = useSelector((state) => state.company.value);
    const [ state, dispatch ] = useReducer(recordsReducer, initialState);

    const set = (a, b) => dispatch({type:'set', var:a, pay:b});

    useEffect(() => {
        getInvoices(selectedParty.id, invoiceCurrency); 
    }, [selectedParty, payType]);

    useEffect(() => {
            if(!state.autoOn){
                calculateGainLoss();
            }
    }, [state.invoices, state.manualExRate]);

    const calculateGainLoss = () => {
        let tempGainLoss = 0.00;
        console.log(state.invoices)
        state.invoices.forEach((x)=>{
            if(x.receiving && x.receiving!=0){
                tempGainLoss = tempGainLoss + parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))
            }
        })
        set('gainLossAmount', tempGainLoss.toFixed(2))
    }

    const getCurrencyInfo = (heads) => {
        let currencyOne = heads[0].currency;
        let currencyTwo = '';
        let returnValue = '';
        heads.forEach((x, i) => {
            currencyTwo = x.currency;
            if(i>0 && currencyOne!=currencyTwo){
                returnValue = "Multi";
            } else {
                returnValue = x.currency;
            }
        })
        return returnValue;
    }

    const getInvoices = async(id, invoiceCurrency) => {
        set('load', true);
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, 
            {
                headers:{id:id, pay:payType, invoiceCurrency:invoiceCurrency}
            }).then(async(x)=>{
            let temp = [];
            x.data.result.forEach((y)=>{
                if(y.Charge_Heads.length!=0){
                    temp.push({
                        ...y,
                        check:false,
                        receiving:0.00,
                        ex_rate:y.Charge_Heads[0].ex_rate,
                        currency:getCurrencyInfo(y.Charge_Heads),
                        inVbalance:getNetInvoicesAmount(y.Charge_Heads).netAmount
                    })
                }
            });
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
        let val = resetAll();
        if(state.auto=='0'||state.auto==null){
            openNotification('Alert', 'Please Enter A Number', 'orange');
        } else {
            let newExAmount = 0.00;
            let oldExAmount = 0.00;
            let tempAmount = parseFloat(state.auto).toFixed(2);
            let pendingFund = 0;
            val.forEach((x) => {
                pendingFund = parseFloat((parseFloat(x.inVbalance) - parseFloat(x.receiving==null?0:x.receiving)).toFixed(2));
                if(pendingFund >= tempAmount) {
                    x.receiving = (parseFloat(x.receiving) + parseFloat(tempAmount)).toFixed(2);
                    tempAmount = 0.00;
                } else if (tempAmount==0.00) {
                    null
                } else if (pendingFund < tempAmount){
                    x.receiving = pendingFund;
                    tempAmount = tempAmount - pendingFund;
                }
                pendingFund = 0.00;
            })

            val.forEach((x)=>{
                newExAmount = parseFloat(newExAmount) + (parseFloat(x.receiving)*parseFloat(state.exRate));
                oldExAmount = parseFloat(oldExAmount) + (parseFloat(x.receiving)*parseFloat(x.ex_rate));
            })
            console.log(val);
            set('gainLossAmount', (newExAmount-oldExAmount).toFixed(2));
            set('invoices', val);
            //calculateGainLoss();
        }
    }

  return (
    <>
    <div>
        <Row>
            <Col md={7}>
                <AgentTransactionInfo state={state} dispatch={dispatch} payType={payType} invoiceCurrency={invoiceCurrency} />
            </Col>
            <Col md={5} className="">
                <div className="mb-2 "
                    onClick={()=>{
                        set('autoOn', !state.autoOn);
                        set('invoices', resetAll());
                        set('exRate', '1');
                        set('gainLossAmount', 0.00);
                        set('auto', '0');
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
                            min="0.00" stringMode 
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
                            onClick={()=>autoKnocking()}
                        >Set</button>
                    </Col>
                    {!state.autoOn &&
                    <Col md={12}>
                    <div style={{maxWidth:100}}>
                    <span className='grey-txt'>Ex. Rate</span>
                        <InputNumber size='small'
                            min="0.00" stringMode 
                            style={{width:'100%', paddingRight:20}} 
                            value={state.manualExRate} 
                            onChange={(e)=>set('manualExRate', e)} 
                        />
                    </div>
                    </Col>
                    }
                    <Col md={3} className="mt-3">
                        <div className='grey-txt fs-14'>Tax Amount</div>
                        <InputNumber size='small'  value={state.taxAmount} disabled={state.isPerc?true:false} onChange={(e)=>set('taxAmount',e)} min="0.0" />
                    </Col>
                    <Col md={1} className="mt-3">
                        <div className='grey-txt mb-1 fs-14'>%</div>
                        <Checkbox size='small'  checked={state.isPerc} onChange={()=>set('isPerc',!state.isPerc)} />
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
                    <Col md={4} className="mt-3">
                        <div className='grey-txt fs-14'>
                            {state.gainLossAmount==0.00 && <br/>}
                            {state.gainLossAmount>0 && <span style={{color:'red'}}><b>Loss</b></span>}
                            {state.gainLossAmount<0 && <span style={{color:'green'}}><b>Gain</b></span>}
                        </div>
                        <div className="custom-select-input-small" >{Math.abs(state.gainLossAmount)}</div>
                    </Col>
                    <Col className="mt-3" md={8}>
                        <div className="grey-txt fs-14">Gain / Loss Account</div>
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
        <div style={{minHeight:300}}>
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
                <th>Ex. Rate</th>
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
                <td style={{width:100}}>{x.currency}</td>
                <td style={{width:100}}>{x.ex_rate}</td>
                <td>{x.inVbalance}</td>
                <td style={{padding:3, width:150}}>
                    <InputNumber style={{height:30, width:140}} value={x.receiving} min="0.00" max={`${x.inVbalance}`} stringMode  disabled={state.autoOn}
                        onChange={(e)=>{
                            let tempState = [...state.invoices];
                            tempState[index].receiving = e;
                            set('invoices', tempState);
                        }}
                    />
                </td>
                <td>
                {(parseFloat(x.inVbalance)-parseFloat(x.recieved==null?0:x.recieved)-parseFloat(x.receiving==null?0:x.receiving)).toFixed(2)}
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
        </div>
        }
    </>
    }
    {state.load && <div className='text-center' ><Spinner /></div>}
    </>
  )
}

export default AgentBillComp