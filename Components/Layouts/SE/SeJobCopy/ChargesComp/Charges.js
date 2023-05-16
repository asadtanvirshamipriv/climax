import { useWatch } from "react-hook-form";
import { CloseCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import SelectSearchComp from "../../../../Shared/Form//SelectSearchComp";
import InputNumComp from "../../../../Shared/Form/InputNumComp";
import { Select, Modal, Tag, InputNumber } from 'antd';
import { getVendors, getClients } from '../states';
import SelectComp from "../../../../Shared/Form/SelectComp";
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import PopConfirm from '../../../../Shared/PopConfirm';
import React, { useEffect, useState } from 'react';
import PartySearch from './PartySearch';
import { saveHeads, calculateChargeHeadsTotal, makeInvoice, getHeadsNew } from "../states";

const ChargesList = ({state, dispatch, type, append, reset, fields, chargeList, control, register, companyId}) => {

    const [ selection, setSelection ] = useState({
        partyId:null,
        InvoiceId:null
    });
    
    useEffect(() => {
        if(chargeList){
            let list = chargeList.filter((x)=> x.check);
            list.length>0?
            setSelection({InvoiceId:list[0].InvoiceId, partyId:list[0].partyId}):
            setSelection({partyId:null, InvoiceId:null})
        }
    }, [chargeList])

    function calculate (){
        let tempChargeList = [...chargeList];
        for(let i = 0; i<tempChargeList.length; i++){
            let amount = tempChargeList[i].amount - tempChargeList[i].discount;
            let tax = 0.00;
            if(tempChargeList[i].tax_apply==true){
                tax = (amount/100.00) * tempChargeList[i].taxPerc;
                tempChargeList[i].tax_amount = tax;
                tempChargeList[i].net_amount = amount + tax
            }else{
                tempChargeList[i].net_amount = amount
            }
            
            tempChargeList[i].local_amount = (tempChargeList[i].net_amount*tempChargeList[i].ex_rate).toFixed(2);
        }
        let tempChargeHeadsArray = calculateChargeHeadsTotal(tempChargeList, 'full');
        dispatch({type:'set', payload:{...tempChargeHeadsArray}})
        reset({ chargeList: tempChargeList });
    }
  return(
    <>
    <Row>
        <Col style={{maxWidth:150}} className="">
        <div className='div-btn-custom text-center py-1'
            onClick={()=>{
            append({
                description:'', basis:'', pp_cc:state.selectedRecord.freightType=="Prepaid"?'PP':'CC', 
                type:state.chargesTab=='1'?'Recievable':"Payble", new:true,  ex_rate: parseFloat(state.exRate), 
                local_amount: 0,  size_type:'40HC', dg_type:state.selectedRecord.dg=="Mix"?"DG":state.selectedRecord.dg, 
                qty:1, currency:'USD', amount:0, check: false, bill_invoice: '', charge: '', particular: '',
                discount:0, tax_apply:false, taxPerc:0.00, tax_amount:0, net_amount:0, invoiceType:"", name: "", 
                partyId:"", sep:false, status:'', approved_by:'', approval_date:'', InvoiceId:null, 
                SEJobId:state.selectedRecord.id
            })}}
        >Add Charge</div>
        </Col>
        <Col>
        <div className='div-btn-custom text-center mx-0 py-1 px-3' style={{float:'right'}} 
            onClick={async()=>{
                await calculate();
                await saveHeads(chargeList, state, dispatch);
                getHeadsNew(state.selectedRecord.id, dispatch);
            }}
        >Save</div>
        <div className='div-btn-custom-green text-center py-1 mx-2 px-3' style={{float:'right'}}
            onClick={async()=>{
                await makeInvoice(chargeList, companyId);
                getHeadsNew(state.selectedRecord.id, dispatch);
            }}
        >Create Invoice</div>
        <div className='div-btn-custom-green text-center py-1 px-3' style={{float:'right'}}onClick={()=>{calculate(chargeList)}}>Calculate</div>
        <div className='mx-2' style={{float:'right'}}>
        <InputNumber placeholder='Ex.Rate' size='small' className='my-1' min={"0.1"} 
            value={state.exRate} 
            onChange={(e)=>dispatch({type:'toggle',fieldName:'exRate',payload:e})} 
        />
        </div>
        <div className='my-1' style={{float:'right'}}>Ex.Rate</div>
        </Col>
    </Row>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
      {!state.chargeLoad &&
      <Table className='tableFixHead' bordered>
      <thead>
        <tr className='table-heading-center'>
          <th>Sr.</th>
          <th></th>
          <th>Select</th>
          <th>Bill/Invoice</th>
          <th>Charge</th>
          <th>Particular</th>
          <th>Basis</th>
          <th>PP/CC</th>
          <th>SizeType</th>
          <th style={{minWidth:95}}>DG Type</th>
          <th>Qty</th>
          <th>Currency</th>
          <th>Amount</th>
          <th>Discount</th>
          <th style={{minWidth:100}}>Tax Apply</th>
          <th style={{minWidth:100}}>Tax Amount</th>
          <th style={{minWidth:100}}>Net Amount</th>
          <th>Ex.Rate</th>
          <th style={{minWidth:110}}>Local Amount</th>
          <th>Name</th>
          <th>Status</th>
          <th style={{minWidth:110}}>Approved By</th>
          <th style={{minWidth:120}}>Approval Date</th>
        </tr>
      </thead>
      <tbody>
      {fields.map((x, index) => {
      return (<>
        {x.type==type && 
        <tr key={index} className='f table-row-center-singleLine'>
            <td>{index + 1}</td>
            <td className='text-center'>
                <CloseCircleOutlined className='cross-icon' style={{ position: 'relative', bottom: 3 }}
                    onClick={() => {
                        PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
                            () => {
                                let tempState = [...chargeList];
                                let tempDeleteList = [...state.deleteList];
                                tempDeleteList.push(tempState[index].id);
                                tempState.splice(index, 1);
                                reset({ chargeList: tempState });
                                dispatch({ type: 'toggle', fieldName: 'deleteList', payload: tempDeleteList });
                            })
                    }}
                />
            </td>
            <td className='text-center'>
                <input type="checkbox" {...register(`chargeList.${index}.check`)}
                    style={{ cursor: 'pointer' }} 
                    //disabled={x.id == null ? true : ((selectingId != "" && selectingId != x.partyId) ? true : false)}
                    disabled={x.partyId==selection.partyId?false:selection.partyId==null?false:true}
                />
            </td>
            <td className='text-center'>{/* Invoice Number */}
                {x.invoice_id != null &&
                    <Tag color="geekblue" style={{ fontSize: 15, cursor: "pointer" }}
                        onClick={() => {
                            dispatch({
                                type: 'set',
                                payload: { selectedInvoice: x.invoice_id, tabState: "5" }
                            })
                        }}
                    >{x.invoice_id}</Tag>
                }
            </td>
            <td style={{ padding: 3, minWidth: 100 }}> {/* charge selection */}
                <Select className='table-dropdown' showSearch value={x.charge} style={{ paddingLeft: 0 }}
                    onChange={(e) => {
                        let tempChargeList = [...chargeList];
                        state.fields.chargeList.forEach(async (y, i) => {
                            if (y.code == e) {
                                tempChargeList[index].charge = e;
                                tempChargeList[index].particular = y.name;
                                tempChargeList[index].basis = y.calculationType;
                                tempChargeList[index].taxPerc = y.taxApply == "Yes" ? parseFloat(y.taxPerc) : 0.00;
                                let partyType = "";
                                let choiceArr = ['', 'defaultRecivableParty', 'defaultPaybleParty'];// 0=null, 1=recivable, 2=payble
                                partyType = y[choiceArr[parseInt(state.chargesTab)]];
                                let searchPartyId;
                                if (partyType == "Client") {
                                    searchPartyId = state.selectedRecord.ClientId;
                                } else if (partyType == "Local-Agent") {
                                    searchPartyId = state.selectedRecord.localVendorId;
                                } else if (partyType == "Custom-Agent") {
                                    searchPartyId = state.selectedRecord.customAgentId;
                                } else if (partyType == "Transport-Agent") {
                                    searchPartyId = state.selectedRecord.transporterId;
                                } else if (partyType == "Forwarding-Agent") {
                                    searchPartyId = state.selectedRecord.forwarderId;
                                } else if (partyType == "Overseas-Agent") {
                                    searchPartyId = state.selectedRecord.overseasAgentId;
                                } else if (partyType == "Shipping-Line") {
                                    searchPartyId = state.selectedRecord.shippingLineId;
                                }
                                let partyData = partyType == "Client" ? await getClients(searchPartyId) : await getVendors(searchPartyId);
                                if (state.chargesTab == '1') {
                                    tempChargeList[index].invoiceType = partyData[0].types.includes("Overseas Agent") ? "Agent Bill" : "Job Invoice";
                                } else {
                                    tempChargeList[index].invoiceType = partyData[0].types.includes("Overseas Agent") ? "Agent Invoice" : "Job Bill";
                                }
                                tempChargeList[index].name = partyData[0].name;
                                tempChargeList[index].partyId = partyData[0].id;
                                tempChargeList[index].partyType = partyType == "Client" ? "client" : "vendor";
                                console.log(tempChargeList)
                                reset({ chargeList: tempChargeList })
                            }
                        })
                        //calculate(index, chargeList[index].amount, chargeList[index].discount, chargeList[index].tax_apply, "No", chargeList[index].ex_rate, chargeList[index].qty)
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={state.fields.chargeList}
                />
            </td>
            <td>{x.particular}</td>
            <td>{x.invoiceType} {/* Basis */}</td>
            <td style={{ padding: 3, minWidth: 50 }}> {/* PP?CC */}
                <SelectComp register={register} name={`chargeList.${index}.pp_cc`} control={control} width={60} font={13}
                    options={[
                        { id: 'PP', name: 'PP' },
                        { id: 'CC', name: 'CC' }
                    ]}
                />
            </td>
            <td style={{ padding: 3 }}> {/* Size/Type */}
                <SelectSearchComp register={register} name={`chargeList.${index}.size_type`} control={control} width={100} font={13}
                    options={[
                        { id: '40HC', name: '40HC' },
                        { id: '20HC', name: '20HC' }
                    ]}
                />
            </td>
            <td style={{ padding: 3 }}> {/* DG */}
                <SelectSearchComp register={register} name={`chargeList.${index}.dg_type`} control={control} width={100} font={13}
                    options={[
                        { id: 'DG', name: 'DG' },
                        { id: 'non-DG', name: 'non-DG' }
                    ]}
                />
            </td>
            <td style={{ padding: 3 }}>
                <InputNumComp register={register} name={`chargeList.${index}.qty`} control={control} width={30} font={13} />
            </td> {/* QTY */}
            <td style={{ padding: 3 }}> {/* Currency */}
                <SelectSearchComp register={register} name={`chargeList.${index}.currency`} control={control} width={100} font={13}
                    options={[
                        { id: 'PKR', name: 'PKR' },
                        { id: 'USD', name: 'USD' },
                        { id: 'EUR', name: 'EUR' },
                        { id: 'GBP', name: 'GBP' },
                        { id: 'AED', name: 'AED' }
                    ]}
                />
            </td>
            <td style={{ padding: 3 }}> {/* Amount */}
                <InputNumComp register={register} name={`chargeList.${index}.amount`} control={control} label='' width={20} />
            </td>
            <td style={{ padding: 3 }}>  {/* Discount */}
                <InputNumComp register={register} name={`chargeList.${index}.discount`} control={control} width={30} font={13} />
            </td>
            <td style={{ textAlign: 'center' }}> {/* Tax Apply */}
                <input type="checkbox" {...register(`chargeList.${index}.tax_apply`)} style={{ cursor: 'pointer' }} />
            </td>
            <td>{x.tax_amount}</td> {/* Tax Amount */}
            <td>{x.net_amount}</td>
            <td style={{ padding: 3 }}> {/* Ex. Rate */}
                <InputNumComp register={register} name={`chargeList.${index}.ex_rate`} control={control} label='' width={10} />
            </td>
            <td>{x.local_amount}</td>
            <td className='text-center'>{/* Party Selection */}
                <div className=''>
                    {x.new == true && <RightCircleOutlined style={{ position: 'relative', bottom: 3 }}
                        onClick={() => {
                            dispatch({ type: 'set', payload: { headIndex: index, headVisible: true } }); //<--Identifies the Head with there Index sent to modal
                        }}
                    />
                    }{x.name != "" ? <span className='m-2 '><Tag color="geekblue" style={{ fontSize: 15 }}>{x.name}</Tag></span> : ""}
                </div>
            </td>
            <td>Un-Approved</td><td></td><td></td>
        </tr>
        }
      </>
      )})}
      </tbody>
      </Table>
      }
      {state.chargeLoad && <div style={{textAlign:"center", paddingTop:'5%', paddingBottom:"5%"}}><Spinner/></div>}
        <Modal
            open={state.headVisible}
            onOk={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})} 
            onCancel={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})}
            width={900} footer={false} maskClosable={false}
        >{state.headVisible && <PartySearch state={state} dispatch={dispatch} reset={reset} useWatch={useWatch} control={control} />}
        </Modal>
      </div>
    </>
  )
}
export default ChargesList