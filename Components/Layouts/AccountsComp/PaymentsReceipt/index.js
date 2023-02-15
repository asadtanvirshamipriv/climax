import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Input, List, Radio, Modal } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from 'axios';
import BillComp from './BillComp';

const PaymentsReceipt = () => {

    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [partytype, setPartyType] = useState("client");
    const [payType, setPayType] = useState("Recievable");
    const [partyOptions, setPartyOptions] = useState([]);
    const [selectedParty, setSelectedParty] = useState({id:'', name:''});

    useEffect(() => { searchParties() }, [search]);

    const searchParties = async() => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type:partytype })
            .then((x)=> setPartyOptions(x.data.result))
        }
    }

    const ListComp = ({data}) => {
        return(
            <List size="small" bordered
                dataSource={data}
                renderItem={(item)=>
                    <List.Item key={item.id} 
                        className='searched-item' 
                        onClick={()=>{
                            setSelectedParty({id:item.id, name:item.name});
                            setVisible(true);
                        }}
                    >
                        {item.name}
                    </List.Item>
                }
            />
        )
    }

  return (
    <div className='base-page-layout'>
        <Row>
            <Col md={12} xs={12}>
                <h4 className='fw-7'>Payments / Receipts</h4>
            </Col>
            <Col style={{maxWidth:200}}>
                <div>Type</div>
                <Radio.Group className='mt-1' 
                    value={partytype}
                    onChange={(e)=>{
                        setPartyType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"vendor"}>Vendor</Radio>
                </Radio.Group>
            </Col>
            <Col style={{maxWidth:250}}>
                <div>Payment</div>
                <Radio.Group className='mt-1' 
                    value={payType}
                    onChange={(e)=>{
                        setPayType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"Payble"}>Payble</Radio>
                    <Radio value={"Recievable"}>Recievable</Radio>
                </Radio.Group>
            </Col>
            <Col style={{maxWidth:400}}>
                <div>Search</div>
                <Input style={{ width: 400 }} placeholder="Search" 
                    suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                />
                {search.length>2 &&
                    <div style={{position:"absolute", zIndex:10}}>
                        <ListComp data={partyOptions} />
                    </div>
                }
            </Col>
            <Col md={12}>
                <hr/>
            </Col>
        </Row>
        <Modal title={`${selectedParty.name}'s Invoices/Bills`} open={visible} 
            onOk={()=>setVisible(false)} 
            onCancel={()=>setVisible(false)}
            footer={false} maskClosable={false}
            width={'100%'}
        >
            <BillComp selectedParty={selectedParty} payType={payType} />
        </Modal>
    </div>
  )
}

export default PaymentsReceipt