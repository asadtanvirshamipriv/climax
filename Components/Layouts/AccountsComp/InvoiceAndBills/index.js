import React, { useEffect, useState } from 'react';
import InvoiceCharges from '../../../Shared/InvoiceCharges';
import axios from "axios";
import { Row, Col, Spinner } from 'react-bootstrap';
import { Input, Empty } from 'antd';
import openNotification from '../../../Shared/Notification';

const InvoiceAndBills = () => {

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState({});

  const searchInvoice = async() => {
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_NO, {
        headers:{"invoice_No": `${search}`}
    }).then((x)=>{
        if(x.data.result.resultOne!=null){
          setInvoice(x.data.result);
        }else {
          setInvoice({});
          openNotification('Error', `Invoice No. "${search}" Dosen't Exists!`, 'orange')
        }
    })
    setLoad(false);
  }

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12} xs={12}>
            <h4 className='fw-7'>Invoices / Bills</h4>
        </Col>
        <Col md={3}>
            <Input onChange={(e)=>setSearch(e.target.value)} value={search} placeholder="Enter Bill / Invoice No." />
        </Col>
        <Col md={2}>
            <button className='btn-custom' onClick={()=>searchInvoice()}>Search</button>
        </Col>
      </Row>
      <hr/>
      {!load &&
      <Row>
        {Object.keys(invoice).length>0 &&
          <Col md={12}>
            <InvoiceCharges data={invoice} />
          </Col>
        }
        {Object.keys(invoice).length==0 &&
          <div className='py-5'>
              <Empty />
          </div>
        }
      </Row>
      }
      {load &&
        <div className='my-5 py-5 text-center'><Spinner size='lg' /></div>
      }
    </div>
  )
}

export default InvoiceAndBills