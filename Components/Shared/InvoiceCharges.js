import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import moment from "moment";

const InvoiceCharges = ({data}) => {

    let inputRef = useRef(null);

    const [records, setRecords] = useState([]);
    const [invoice, setInvoice] = useState({});

    useEffect(()=>{
        if(Object.keys(data).length>0){
            setInvoice(data.resultOne)
            setRecords(data.resultOne.Charge_Heads)
        }
    },[data])

    const calculateTotal = (data) => {
        let result = 0;
        data.forEach((x)=>{
            result = result + parseFloat(x.local_amount)
        });
        return result.toFixed(2);
    }

  return (
    <div className='invoice-styles'>
    {Object.keys(data).length>0 &&
    <>
    <div style={{maxWidth:70}}>
        <ReactToPrint
            content={() => inputRef }
            trigger={() => <div className='div-btn-custom text-center p-2'>Print</div>}
        />
    </div>
    <Row className='py-3'>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Invoice No#:</span>
                <span className='inv-value'>{" "}{invoice.invoice_No}</span>
            </div>
        </Col>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Party Name:</span>
                <span className='inv-value'>{" "}{invoice.party_Name}</span>
            </div>
        </Col>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Pay Type:</span>
                <span className='inv-value'>{" "}{invoice.payType}</span>
            </div>
        </Col>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Currency:</span>
                <span className='inv-value'>{" "}{invoice.currency}</span>
            </div>
        </Col>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Invoie/Bill:</span>
                <span className='inv-value'>{" "}{invoice.type}</span>
            </div>
        </Col>
        <Col md={3} className="mb-3">
            <div>
                <span className='inv-label'>Created:</span>
                <span className='inv-value'>{" "}{ moment(invoice.createdAt).format("DD / MMM / YY")}</span>
            </div>
        </Col>
    </Row>
    <div style={{minHeight:300}}>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
        <thead>
            <tr className='table-heading-center'>
            <th>Sr.</th>
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
            </tr>
        </thead>
        <tbody>
        {records.map((x, index) => {
        return (
        <tr key={index} className='f table-row-center-singleLine'>
            <td>{index + 1}</td>
            <td>{x.charge}</td>
            <td>{x.particular}</td>
            <td></td>
            <td>{x.basis.slice(0, 8)}</td>
            <td>{x.pp_cc}</td>
            <td>{x.size_type}</td>
            <td>{x.dg_type}</td>
            <td>{x.qty}</td>
            <td>{x.currency}</td>
            <td>{x.amount}</td>
            <td>{x.discount}</td>
            <td style={{textAlign:'center'}}>{x.tax_apply}</td>
            <td>{x.tax_amount}</td>
            <td>{x.net_amount}</td>
            <td>{x.ex_rate}</td>
            <td>{x.local_amount}</td>
        </tr>
            )
        })}
        </tbody>
        </Table>
        </div>
    </div>
    <hr/>
    <div>
        <Row>
            <Col md={3} className="text-center py-3">
            <div className=''>
                <span className='inv-label mx-2'>Total Amount:</span>
                <span className='inv-value charges-box p-2'>{" "}{calculateTotal(records)}</span>
            </div>
            </Col>
        </Row>
    </div>
    </>
    }
    <div 
        style={{display:"none"}}
    >
    <div ref={(response) => (inputRef = response)} >
    <div className='p-5'>
    <div className='text-center '>
            <h4>SEA NET SHIPPING & LOGISTICS</h4>
            <div>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
            <div>Tel: 9221 34395444-55-66   Fax: 9221 34385001</div>
            <div>Email: info@seanetpk.com   Web: www.seanetpk.com</div>
            <div>NTN # 8271203-5</div>
    </div>
        <div className='charges-box my-5'>
            <p className='text-center'><strong>{invoice.type}</strong></p>
            <Table className='' bordered>
            <thead>
                <tr className='table-heading-center'>
                <th>Sr.</th>
                <th>Charge</th>
                <th>Currency</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>  
                </tr>
            </thead>
            <tbody>
            {records.map((x, index) => {
            return (
            <tr key={index} className='f table-row-center-singleLine'>
                <td className='text-center'>{index + 1}</td>
                <td className='text-center'>{x.particular}</td>
                <td className='text-center'>{x.currency}</td>
                <td className='text-center'>{x.qty}</td>
                <td className='text-center'>{x.discount}</td>
                <td className='text-center'>{x.tax_amount}</td>
                <td className='text-center'>{x.net_amount}</td>
            </tr>
                )
            })}
            </tbody>
            </Table>
            <hr/>
            <Row>
                <Col md={12} className="text-center p-5">
                <div className='' style={{float:'right', borderBottom:"1px solid silver"}}>
                    <span className='inv-label mx-2'>Total Amount:</span>
                    <span className='inv-value charges-box p-2'>{" "}{calculateTotal(records)}</span>
                </div>
                </Col>
            </Row>
        </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default InvoiceCharges