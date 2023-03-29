import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import moment from "moment";

const Sheet = ({data, payType}) => {

    const [records, setRecords] = useState([]);

    useEffect(() => {
      let tempData = [];
      data.forEach((x, i) => {
        x.Invoices.forEach((y, j) => {
            let pay = y.payType=="Payble"?(parseFloat(y.total) + parseFloat(y.roundOff)):""
            let rec = y.payType!="Payble"?(parseFloat(y.total) + parseFloat(y.roundOff)):""
            tempData.push({ 
                ...x, Invoices:y,
                receivable:rec,
                payble:pay,
                balance:y.payType!="Payble"?rec-y.recieved:pay-y.paid
            });
        })
      });
      setRecords(tempData);
    }, [data])

    const getTotal=(values, type)=>{
        let result = 0.00;
        console.log(values)
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

    const getAge = (date) => {
        let date1 = new Date(date);
        let date2 = new Date();

        let difference = date2.getTime() - date1.getTime();

        return parseInt(difference/86400000)
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
                <th>Age</th>
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
                {payType=="Recievable" &&<td>{(parseFloat(x.Invoices.total) + parseFloat(x.Invoices.roundOff)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>}
                {payType!="Recievable" &&<td>{x.payble.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>}
                {payType=="Recievable" &&<td>{parseFloat(x.Invoices.recieved).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>}
                {payType!="Recievable" &&<td>{x.Invoices.payType=="Payble"?x.Invoices.paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", "):""}</td>}
                <td>{x.balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
                <td>{getAge(x.Invoices.createdAt)}</td>
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
                {payType=="Recievable" &&<td>{getTotal(records, "Recievable")}</td>}
                {payType!="Recievable" &&<td>{getTotal(records, "Payble")}</td>}
                {payType=="Recievable" &&<td>{getTotal(records, "Recieved")}</td>}
                {payType!="Recievable" &&<td>{getTotal(records, "Paid")}</td>}
                <td>{getTotal(records, "balance").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
                <td></td>
            </tr>
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet