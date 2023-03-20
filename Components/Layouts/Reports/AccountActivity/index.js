import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Select } from 'antd';

const AccountActivity = ({childAccounts}) => {

    const [records, setRecords] = useState([]);
    const [accountId, setAccountId] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
      console.log(childAccounts.result);
      let temprecords = [];
      childAccounts.result.forEach((x)=>{
        temprecords.push({value:x.id, label:x.title})
      })
      setRecords(temprecords);
    }, [])
    
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

  return (
    <div className='base-page-layout'>
        <Row>
            <Col md={12} xs={12}><h4 className='fw-7'>Account Activity</h4></Col>
            <Col md={3}>
            <Select
                showSearch
                style={{
                width: '100%',
                }}
                placeholder="Tags Mode"
                onChange={handleChange}
                options={records}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
            />
            </Col>
        </Row>
    </div>
  )
}

export default AccountActivity