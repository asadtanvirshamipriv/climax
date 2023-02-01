import React, { useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Select, Input } from 'antd';
import PopConfirm from '../../../Shared/PopConfirm';

const PaybleCharges = ({state, dispatch}) => {

  function calculate (i, amount, discount, taxApply, tax_rate, exRate){
    let tempChargeList = [...state.paybleCharges];
    tempChargeList[i].amount = amount;
    tempChargeList[i].discount = discount;
    tempChargeList[i].ex_rate = exRate;
    tempChargeList[i].net_amount = (tempChargeList[i].amount - tempChargeList[i].discount);
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
    dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempChargeList});
  }

  return (<div>
    <Row>
        <Col style={{maxWidth:150}} className="">
            <div className='div-btn-custom text-center py-1'
                onClick={()=>{
                    let tempState = state.reciveableCharges;
                    tempState.push(state.chargeBody);
                    dispatch({type:'toggle', fieldName:'reciveableCharges', payload:tempState});
                }}
            >Add Charge</div>
        </Col>
    </Row>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
       <Table className='tableFixHead' bordered>
      <thead>
        <tr className='table-heading-center'>
          <th>...</th>
          <th>Sr.</th>
          <th>Bill/Invoice</th>
          <th>Charge</th>
          <th>Particular</th>
          <th>Description</th>
          <th>Type</th>
          <th>Basis</th>
          <th>PP/CC</th>
          <th>SizeType</th>
          <th style={{minWidth:95}}>DG Type</th>
          <th>Manual</th>
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
      {state.paybleCharges.map((x, index) => {
      return (
      <tr key={index} className='f table-row-center-singleLine'>
        <td>
            <CloseCircleOutlined className='cross-icon'
                onClick={() => {
                    PopConfirm(
                    "Confirmation",
                    "Are You Sure To Remove This Charge?",
                    ()=>{
                        let tempState = [...state.paybleCharges];
                        tempState.splice(index,1)
                        dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempState});
                    })
                }}
            />
        </td>
        <td>{index + 1}</td>
        <td>{state.selectedRecord.jobNo}</td>
        <td style={{padding:3, minWidth:150}}>
            <Select
                className='table-dropdown'
                showSearch
                value={x.charge}
                onChange={(e)=>{
                    let tempChargeList = [...state.paybleCharges];
                    state.fields.chargeList.forEach((y, i)=>{
                        if(y.code==e){
                            tempChargeList[index].charge=e;
                            tempChargeList[index].particular=y.name;
                            tempChargeList[index].type=y.calculationType;
                            tempChargeList[index].currency=y.currency;
                            dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempChargeList});
                        }
                    })
                    calculate(index, x.amount, x.discount, x.tax_apply, "No", x.ex_rate)
                }}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                options={state.fields.chargeList}
            />
        </td>
        <td>{x.particular}</td>
        <td></td> 
        <td>INVOICE</td>
        <td>{x.type.slice(0, 8)} </td>
        <td style={{padding:3, minWidth:50}}>
            <Select
                value={x.pp_cc}
                onChange={(e)=>{
                    let tempChargeList = [...state.paybleCharges];
                    tempChargeList[index].pp_cc=e;
                    dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempChargeList});
                }}
                className='table-dropdown'
                options={[
                    {label:'PP', value:'PP'},
                    {label:'CC', value:'CC'},
                ]}
            />
        </td>
        <td style={{padding:3, minWidth:50}}> 
            <Select
                value={x.size_type}
                onChange={(e)=>{
                    let tempChargeList = [...state.paybleCharges];
                    tempChargeList[index].size_type = e
                    dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempChargeList});
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
        <td style={{padding:3, minWidth:50}}> 
            <Select
                className='table-dropdown'
                value={x.dg_type}
                onChange={(e)=>{
                    let tempChargeList = [...state.paybleCharges];
                    tempChargeList[index].dg_type = e
                    dispatch({type:'toggle', fieldName:'paybleCharges', payload:tempChargeList});
                }}
                options={[
                    {label:'DG', value:'DG'},
                    {label:'non-DG', value:'non-DG'},
                ]}
            />
        </td>
        <td style={{textAlign:'center'}}> 
            <input type="checkbox" style={{cursor:'pointer'}} />
        </td>
        <td>1.00</td> 
        <td>{x.currency}</td>
        <td style={{padding:3, minWidth:50}}> 
            <Input style={{height:30, minWidth:90}} value={x.amount} placeholder="Amounts" 
                onChange={(e)=> calculate(index, e.target.value, x.discount, x.tax_apply, "No", x.ex_rate)} 
            />
        </td>
        <td style={{padding:3, minWidth:50}}>  
            <Input style={{height:30, minWidth:90}} value={x.discount} placeholder="Discount" 
                onChange={(e)=> calculate(index, x.amount, e.target.value, x.tax_apply, "No", x.ex_rate) }
            />
        </td>
        <td style={{textAlign:'center'}}> 
            <input type="checkbox" style={{cursor:'pointer'}}
                checked={x.tax_apply=="No"?false:true}
                onChange={()=> calculate(index, x.amount, x.discount, x.tax_apply=="Yes"?"No":"Yes", "No", x.ex_rate) }
            />
        </td>
        <td>{x.tax_amount}</td> 
        <td>{x.net_amount}</td>
        <td style={{padding:3, minWidth:50}}> 
            <Input style={{height:30, minWidth:90}} placeholder="Ext. Rate" value={x.ex_rate} 
                onChange={(e)=>calculate(index, x.amount, x.discount, x.tax_apply, "No", e.target.value) }
            />
        </td>
        <td>
            {x.local_amount}
        </td>
        <td>{state.selectedRecord.Client.name}</td>
        <td>Un-Approved</td>
        <td></td>
        <td></td>
      </tr>
        )
      })}
      </tbody>
      </Table> 
      </div>
    </div>
  )
}

export default PaybleCharges