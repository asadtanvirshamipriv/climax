import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import moment from "moment";

const Sheet = ({data}) => {

    const [records, setRecords] = useState([]);

    useEffect(() => {
      let tempData = [];
      data.forEach((x, i) => {
        if(x.Invoices.length>1){
            x.Invoices.forEach((y, j) => {
                tempData.push({ ...x, Invoices:y });
            })
        } else { tempData.push({...x, Invoices:x.Invoices[0]}); }
      });
      setRecords(tempData);
    }, [data])

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
                <th>Receivable</th>
                <th>Payble</th>
                <th>Received</th>
                <th>paid</th>
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
                <td>{x.Invoices.payType!="Payble"?getNetInvoicesAmount(x.Invoices.Charge_Heads).localAmount:""}</td>
                <td>{x.Invoices.payType=="Payble"?getNetInvoicesAmount(x.Invoices.Charge_Heads).localAmount:""}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )})}
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet