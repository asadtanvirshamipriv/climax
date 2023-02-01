import React, { useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { CloseCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Select, Input, Modal, Tag } from 'antd';
import PopConfirm from '../../../Shared/PopConfirm';
import PartySearch from './PartySearch';
import axios from 'axios';

const ChargesList = ({state, dispatch, chargeType, chargeVar}) => {

    function calculate (i, amount, discount, taxApply, tax_rate, exRate, qty){
        let tempChargeList = [...chargeType];
        tempChargeList[i].amount = amount;
        tempChargeList[i].qty = qty;
        tempChargeList[i].discount = discount;
        tempChargeList[i].ex_rate = exRate;
        tempChargeList[i].net_amount = (tempChargeList[i].amount*parseInt(tempChargeList[i].qty) - tempChargeList[i].discount);
        tempChargeList[i].tax_apply=taxApply;
        tempChargeList[i].tax_amount=0.0;
        if(taxApply=="Yes"){
            state.fields.chargeList.forEach((x)=>{
                if(x.code==tempChargeList[i].charge){
                    if(x.taxApply=="Yes"){
                        tempChargeList[i].tax_amount=(tempChargeList[i].net_amount/100)*x.taxPerc;
                        tempChargeList[i].net_amount = tempChargeList[i].net_amount + tempChargeList[i].tax_amount
                    }
                }
            })
        }
        tempChargeList[i].local_amount = (tempChargeList[i].net_amount*exRate);
        tempChargeList[i].local_amount = parseFloat(tempChargeList[i].local_amount).toFixed(2);
        tempChargeList[i].tax_amount = parseFloat(tempChargeList[i].tax_amount).toFixed(2);
        tempChargeList[i].net_amount = parseFloat(tempChargeList[i].net_amount).toFixed(2);
        dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempChargeList});
    }

    async function makeInvoice(){
        let charges = [];
        state.paybleCharges.forEach((x)=>{ charges.push(x) })
        state.reciveableCharges.forEach((x)=>{ charges.push(x) })
        // console.log(charges)
        let invoices = [];

        charges.forEach((x) => {
            if(invoices.length==0){
                invoices.push({
                    id:null, party_Id:x.partyId, party_Name:x.name,
                    type:x.invoiceType, status:0, operation:"SE",
                    payType:x.type,
                    job_Id:state.selectedRecord.id
                });
            } else {
                let exist = false
                invoices.forEach((y, i)=>{
                    if(y.party_Id==x.partyId && y.type==x.invoiceType){
                        exist = true
                    }
                    if(i==invoices.length-1 && exist==false){
                        invoices.push({
                            id:null, party_Id:x.partyId, party_Name:x.name,
                            type:x.invoiceType, status:0, operation:"SE",
                            payType:x.type,
                            job_Id:state.selectedRecord.id
                        })
                    }
                })
            }
        });

        invoices.forEach((x, i)=>{
            let addCharges = [];
            charges.forEach((y, j)=>{
                if(y.partyId==x.party_Id && x.type==y.invoiceType){
                    addCharges.push(y)
                }
            })
            invoices[i].charges=addCharges
        });

        console.log(invoices)

        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_SAVE_HEADS, {invoices:invoices, deleteList:state.deleteList})
        .then((x)=>{
            console.log(x.data)
            getHeads();
            dispatch({type:'toggle', fieldName:'deleteList', payload:[]});
        });
    }

    useEffect(() => {  getHeads() }, [state.selectedRecord])

    const getHeads = async() => {
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_HEADS,{
            headers:{"job_id": `${state.selectedRecord.id}`}
        }).then((x)=>{
            console.log(x.data)
            if(x.data.status=="success"){
                let tempCharge = [];
                x.data.result.forEach((x)=>{
                    if(x.payType!='Payble'){
                        x.Charge_Heads.forEach((y)=>{
                            tempCharge.push(y);
                        })
                    }
                })
                dispatch({type:'toggle', fieldName:'reciveableCharges', payload:tempCharge});
                tempCharge = [];
                x.data.result.forEach((x)=>{
                    if(x.payType=='Payble'){
                        x.Charge_Heads.forEach((y)=>{
                            tempCharge.push(y);
                        })
                    }
                })
                dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempCharge});
            }
        })
    }

    const ApproveCharges = async() => {
        let chargesList = [];
        chargesList.push(...state.paybleCharges)
        chargesList.push(...state.reciveableCharges)
        chargesList = chargesList.filter((x)=> x.check==true)
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_APPROVE_HEADS,chargesList).then(async(x)=>{
            if(x.data.status=="success"){
                await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_HEADS,
                    {invoice:x.data.result, charges:chargesList}
                )
                .then(()=>{
                    setTimeout(() => {
                        getHeads()
                    }, 1000);
                })
            }
        })
    }

  return (
  <div>
    <Row>
        <Col style={{maxWidth:150}} className="">
            <div className='div-btn-custom text-center py-1'
                onClick={()=>{
                    let tempState = [...chargeType];
                    tempState.push({
                        id:null, description:'', basis:'', pp_cc:'', type:state.chargesTab=='1'?'Recievable':"Payble",
                        ex_rate: 1, local_amount: 0,  size_type:'', dg_type:'', qty:1, currency:'', amount:0,
                        check: false, bill_invoice: '', charge: '', particular: '',
                        discount:0, tax_apply:'No', tax_amount:0, net_amount:0,
                        status:'', approved_by:'', approval_date:'',
                        invoiceType:"", //  state.chargesTab=='1'?"Job Invoice":"",
                        name: "",
                        partyId:""
                    });
                    dispatch({type:'toggle', fieldName:state.chargesTab=='1'?"reciveableCharges":"paybleCharges", payload:tempState});
                }}
            >Add Charge</div>
        </Col>
        <Col>
            <div className='div-btn-custom text-center mx-0 py-1 px-3' style={{float:'right'}}
                onClick={()=>makeInvoice()}
            >Save</div>
            <div className='div-btn-custom-green text-center py-1 mx-2 px-3' style={{float:'right'}}
                onClick={()=>{ApproveCharges()}}
            >Approve</div>
        </Col>
    </Row>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
      <Table className='tableFixHead' bordered>
      <thead>
        <tr className='table-heading-center'>
          <th>...</th>
          <th></th>
          <th>Sr.</th>
          <th>Bill/Invoice</th>
          <th>Charge</th>
          <th>Particular</th>
          <th>Description</th>
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
      {chargeType.map((x, index) => {
      return (
      <tr key={index} className='f table-row-center-singleLine'>
        <td>
            <CloseCircleOutlined className='cross-icon'
                onClick={() => {
                    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
                    () => {
                        let tempState = [...chargeType];
                        let tempDeleteList = [...state.deleteList];
                        tempDeleteList.push(tempState[index].id)
                        tempState.splice(index,1)
                        dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempState});
                        dispatch({type:'toggle', fieldName:'deleteList', payload:tempDeleteList});
                    })
                }}
            />
        </td>
        <td>
            <input type="checkbox" style={{cursor:'pointer'}}
                checked={x.check}
                onChange={()=>{
                    let tempState = [...chargeType];
                    tempState[index].check=!tempState[index].check;
                    dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempState});
                }}
            />
        </td>
        <td>{index + 1}</td>
        <td className='text-center'>{/* Invoice Number */}
            {x.invoice_id!="" &&<Tag color="geekblue" style={{fontSize:15, cursor:"pointer"}}
                onClick={()=>{
                    dispatch({type:'toggle', fieldName:'tabState', payload:"5"})
                    dispatch({type:'toggle', fieldName:'selectedInvoice', payload:x.invoice_id})
                }}
            >{x.invoice_id}</Tag>}
        </td>
        <td style={{padding:3, minWidth:150}}> {/* charge selection */}
            <Select className='table-dropdown' showSearch value={x.charge}
                onChange={(e)=>{
                    let tempChargeList = [...chargeType];
                    state.fields.chargeList.forEach((y, i) => {
                        if(y.code==e){
                            tempChargeList[index].charge=e;
                            tempChargeList[index].particular=y.name;
                            tempChargeList[index].basis=y.calculationType;
                            tempChargeList[index].currency=y.currency;
                            dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempChargeList});
                        }
                    })
                    calculate(index, x.amount, x.discount, x.tax_apply, "No", x.ex_rate, x.qty)
                }}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                options={state.fields.chargeList}
            />
        </td>
        <td>{x.particular}</td>
        <td></td> {/* Description */}
        <td>{x.basis.slice(0, 8)} {/* Basis */}</td>
        <td style={{padding:3, minWidth:50}}> {/* PP?CC */}
            <Select
                value={x.pp_cc}
                onChange={(e)=>{
                    let tempChargeList = [...chargeType];
                    tempChargeList[index].pp_cc=e;
                    dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempChargeList});
                }}
                className='table-dropdown'
                options={[
                    {label:'PP', value:'PP'},
                    {label:'CC', value:'CC'},
                ]}
            />
        </td>
        <td style={{padding:3, minWidth:50}}> {/* Size/Type */}
            <Select
                value={x.size_type}
                onChange={(e)=>{
                    let tempChargeList = [...chargeType];
                    tempChargeList[index].size_type = e
                    dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempChargeList});
                }}
                className='table-dropdown'
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                    {label:'40HC', value:'40HC'},
                    {label:'20HC', value:'20HC'},
                ]}
            />
        </td>
        <td style={{padding:3, minWidth:50}}> {/* DG */}
            <Select
                className='table-dropdown'
                value={x.dg_type}
                onChange={(e)=>{
                    let tempChargeList = [...chargeType];
                    tempChargeList[index].dg_type = e
                    dispatch({type:'toggle', fieldName:state.chargesTab=='1'?'reciveableCharges':'paybleCharges', payload:tempChargeList});
                }}
                options={[
                    {label:'DG', value:'DG'},
                    {label:'non-DG', value:'non-DG'},
                ]}
            />
        </td>
        <td style={{padding:3, minWidth:50}}>
            <Input style={{height:30, minWidth:50}} value={x.qty} placeholder="Amounts" 
                onChange={(e)=> calculate(index, x.amount, x.discount, x.tax_apply, "No", x.ex_rate, e.target.value)} 
            />
        </td> {/* QTY */}
        <td>{x.currency}</td>
        <td style={{padding:3, minWidth:50}}> {/* Amount */}
            <Input style={{height:30, minWidth:90}} value={x.amount} placeholder="Amounts" 
                onChange={(e)=> calculate(index, e.target.value, x.discount, x.tax_apply, "No", x.ex_rate, x.qty)} 
            />
        </td>
        <td style={{padding:3, minWidth:50}}>  {/* Discount */}
            <Input style={{height:30, minWidth:90}} value={x.discount} placeholder="Discount" 
                onChange={(e)=> calculate(index, x.amount, e.target.value, x.tax_apply, "No", x.ex_rate, x.qty) }
            />
        </td>
        <td style={{textAlign:'center'}}> {/* Tax Apply */}
            <input type="checkbox" style={{cursor:'pointer'}}
                checked={x.tax_apply=="No"?false:true}
                onChange={()=> calculate(index, x.amount, x.discount, x.tax_apply=="Yes"?"No":"Yes", "No", x.ex_rate, x.qty) }
            />
        </td>
        <td>{x.tax_amount}</td> {/* Tax Amount */}
        <td>{x.net_amount}</td>
        <td style={{padding:3, minWidth:50}}> {/* Ex. Rate */}
            <Input style={{height:30, minWidth:90}} placeholder="Ext. Rate" value={x.ex_rate} 
                onChange={(e)=>calculate(index, x.amount, x.discount, x.tax_apply, "No", e.target.value, x.qty) }
            />
        </td>
        <td>{x.local_amount}</td>
        <td className='text-center'>
            <div className=''>
                {x.id==null && <RightCircleOutlined style={{position:'relative', bottom:3}}
                    onClick={()=>{
                        dispatch({type:'toggle', fieldName:'headIndex', payload:index}); // <--Identifies the Head with there Index sent to modal
                        dispatch({type:'toggle', fieldName:'headVisible', payload:true}); // <--Opens up the modal
                    }}
                />}
                {x.name!=""?<span className='m-2 '><Tag color="geekblue" style={{fontSize:15}}>{x.name}</Tag></span>:""}
            </div>
        </td>
        <td>Un-Approved</td>
        <td></td>
        <td></td>
      </tr>
        )
      })}
      </tbody>
      </Table>

        <Modal
            open={state.headVisible}
            onOk={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})} 
            onCancel={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})}
            width={900} footer={false} maskClosable={false}
            >
            {state.headVisible && <PartySearch state={state} dispatch={dispatch} />}
        </Modal>
      </div>

    </div>
  )
}

export default ChargesList