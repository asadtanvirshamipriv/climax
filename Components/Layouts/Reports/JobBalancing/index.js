import React, { useState, useEffect } from 'react';
import { Input, Select, List, Radio, Modal } from 'antd';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Sheet from './Sheet';

const JobBalancing = () => {

    const [visible, setVisible] = useState(false);
    const [load, setLoad] = useState(true);
    const [type, setType] = useState("client");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedParty, setSelectedParty] = useState([]);
    const [comapnies, setCompanies] = useState([]);
    const [partyOptions, setPartyOptions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => { getCompanies() }, []);
    useEffect(() => { searchParties() }, [search]);
    
    const getCompanies = async() => {
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
        .then((x)=>{
          let tempState = [];
          x.data.result.forEach((x, index) => {
            tempState[index]={value:x.id, label:x.title}
          });
          setCompanies(tempState)
        });
    }

    const searchParties = async() => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type })
            .then((x)=> setPartyOptions(x.data.result) )
        }
    }

    const getJobBalancing = async(id) => {
        //setSearch("");
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_JOB_BALANCING, { id, type })
            .then((x)=> {
                setSelectedParty(x.data.result);
                setVisible(true);
            })
        }
    }
    
    const ListComp = ({data}) => {
        return(
            <List size="small" bordered
                dataSource={data}
                renderItem={(item)=>
                    <List.Item key={item.id} 
                        className='searched-item' 
                        onClick={()=>getJobBalancing(item.id)}
                    >
                        {item.name}
                    </List.Item>
                }
            />
        )
    }

  return (
    <div className='base-page-layout'>
        <h4 className='fw-7'>Search</h4>
        <hr/>
        <Row>
            <Col style={{maxWidth:200}}>
                <div>Company</div>
                <Select defaultValue="" style={{ width: 170 }} 
                    options={comapnies} 
                    onChange={(e)=>setSelectedCompany(e)} 
                />
            </Col>
            <Col style={{maxWidth:200}}>
                <div>Type</div>
                <Radio.Group className='mt-1' 
                    value={type}
                    onChange={(e)=>{
                        setType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"vendor"}>Vendor</Radio>
                </Radio.Group>
            </Col>
            <Col style={{maxWidth:400}}>
                <div>Party</div>
                <Input style={{ width: 400 }}  disabled={selectedCompany==""?true:false} placeholder="Search" 
                    suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                />
                {search.length>2 &&
                    <div style={{position:"absolute", zIndex:10}}>
                        <ListComp data={partyOptions} />
                    </div>
                }
            </Col>
        </Row>
        <Modal title={selectedParty.length>0?selectedParty[0].Invoices[0].party_Name:""} open={visible} 
            onOk={()=>setVisible(false)} 
            onCancel={()=>setVisible(false)}
            footer={false} maskClosable={false}
            width={'100%'}
        >
            {selectedParty.length>0 && <Sheet data={selectedParty} />}
        </Modal>
    </div>
  )
}

export default JobBalancing