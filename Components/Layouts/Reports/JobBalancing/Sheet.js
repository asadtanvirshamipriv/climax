import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import moment from "moment";

const Sheet = ({data, payType}) => {

    const [records, setRecords] = useState([]);

    useEffect(() => {
      let tempData = [];
      data.forEach((x, i) => {
        if(x.Invoices.length>1){
            x.Invoices.forEach((y, j) => {
                console.log(y)
                if(y.Charge_Heads.length>0){
                    let pay = y.payType=="Payble"?getNetInvoicesAmount(y.Charge_Heads).localAmount:""
                    let rec = y.payType!="Payble"?getNetInvoicesAmount(y.Charge_Heads).localAmount:""
                    tempData.push({ 
                        ...x, Invoices:y,
                        receivable:rec,
                        payble:pay,
                        balance:y.payType!="Payble"?rec-y.recieved:pay-y.paid
                    });
                }
            })
        } else {
            if(x.Invoices[0].Charge_Heads.length>0){
                let pay = x.Invoices[0].payType=="Payble"?getNetInvoicesAmount(x.Invoices[0].Charge_Heads).localAmount:""
                let rec = x.Invoices[0].payType!="Payble"?getNetInvoicesAmount(x.Invoices[0].Charge_Heads).localAmount:""
                tempData.push({
                    ...x, 
                    Invoices:x.Invoices[0],
                    receivable:rec,
                    payble:pay,
                    balance:x.Invoices[0].payType!="Payble"?rec-x.Invoices[0].recieved:pay-x.Invoices[0].paid
                }); 
            }
        }
      });
      setRecords(tempData);
    }, [data])

    const getTotal=(values, type)=>{
        let result = 0.00;
        values.forEach((x)=>{
            if(type=="Recievable"){
                result=result+parseFloat(x.receivable)
            }else if(type=="Recieved"){
                result=result+parseFloat(x.Invoices.recieved)
            }else if(type=="balance"){
                result=result+parseFloat(x.balance)
            }else if(type=="Payble"){
                result=result+parseFloat(x.payble)
            }else if(type=="Payble"){
                result=result+parseFloat(x.Invoices.paid)
            }
        })
        return `${result.toFixed(2)}`
    }

  return (
    <div>
        <div className='' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead vertical'>
        <thead>
            <tr className='fs-12 text-center'>
                <th>#</th>
                <th>Inv No</th>
                <th>Job No</th>
                <th>Date</th>
                <th>F. Dest</th>
                <th>Job Type</th>
                <th>Freight Type</th>
                <th>Container</th>
                <th>Weight</th>
                <th>Vol</th>
                {payType=="Recievable" &&<th>Recievable</th>}
                {payType!="Recievable" &&<th>Payble</th>}
                {payType=="Recievable" &&<th>Received</th>}
                {payType!="Recievable" &&<th>paid</th>}
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
        {records.map((x,index)=>{
        return (
            <tr key={index} className='f fs-12 text-center'>
                <td>{index + 1}</td>
                <td>{x.Invoices.invoice_No}</td>
                <td>{x.jobNo}</td>
                <td>{moment(x.Invoices.createdAt).format("MM/DD/YY")}</td>
                <td>{x.fd}</td>
                <td>{x.subType}</td>
                <td>{x.freightType=="Collect"?"CC":"PP"}</td>
                <td>
                    {x.SE_Equipments.map((y, j)=>{
                        return(
                            <div key={j}>
                                {y.qty}
                                    <span style={{position:'relative', bottom:1, fontSize:9}}> x </span>
                                {y.size}
                            </div>
                        )
                    })}
                </td>
                <td>{x.weight}</td>
                <td>{x.vol}</td>
                {payType=="Recievable" &&<td>{x.receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>}
                {payType!="Recievable" &&<td>{x.payble.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>}
                {payType=="Recievable" &&<td>{x.Invoices.payType!="Payble"?x.Invoices.recieved.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", "):""}</td>}
                {payType!="Recievable" &&<td>{x.Invoices.payType=="Payble"?x.Invoices.paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", "):""}</td>}
                <td>{x.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
            </tr>
        )})}
        <tr className='f fs-12 text-center'>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                {payType=="Recievable" &&<td>{getTotal(records, "Recievable")-getTotal(records, "Recieved")}</td>}
                {payType!="Recievable" &&<td>{getTotal(records, "Payble")}</td>}
                {payType=="Recievable" &&<td>{getTotal(records, "Recieved")}</td>}
                {payType!="Recievable" &&<td>{getTotal(records, "Paid")}</td>}
                <td>{getTotal(records, "balance").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
            </tr>
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet