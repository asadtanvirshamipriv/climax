import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Row, Col } from 'react-bootstrap';
import { EditOutlined } from '@ant-design/icons';
import MediumModal from '../../Shared/Modals/MediumModal';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';

const Employees = ({}) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});

  const company = useSelector((state) => state.company.companies);

  useEffect(() => {
    getEmployees();
    return () => { }
  }, [])

  const getEmployees = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES).then((x)=>{
      if(x.data.status=='success'){
        setEmployeeList(x.data.result);
        console.log(x.data.result)
      }
    })
  }

  const updateUser = (x) => {
    let tempState = [...employeeList];
    let i = tempState.findIndex((y=>x.id==y.id));
    tempState[i] = x;
    setEmployeeList(tempState);
  }

  const appendClient = (x, levels) => {
    let tempState = [...employeeList];
    console.log(x)
    x.Access_Levels=levels
    tempState.unshift(x);
    setEmployeeList(tempState);
  }

  const getCompanyName = (id) => {
    let name = '';
    company.forEach(x => {
      if(id==x.id){
        name=x.title
      }
    });
    return name
  }

  return (
  <div className='dashboard-styles'>
    <div className='base-page-layout'>
      <Row>
      <Col md={12}>
        <Row>
        <Col><h5>Employees</h5></Col>
        <Col><button className='btn-custom' onClick={()=>setVisible(true)} style={{float:'right'}}>Create</button></Col>
        </Row>
        <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
        <MediumModal visible={visible} setVisible={setVisible} setEdit={setEdit} width={800}>
          <CreateOrEdit appendClient={appendClient} edit={edit} setVisible={setVisible} setEdit={setEdit} selectedEmployee={selectedEmployee} updateUser={updateUser} company={company} />
        </MediumModal>
      </Col>
      <Col md={12}>
        <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Code</th>
            <th>Basic Info</th>
            <th>Company Info</th>
            <th>Bank Info</th>
            <th>History</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
        {
        employeeList.map((x, index) => {
        return (
        <tr key={index} className='f'>
          <td>{index + 1}</td>
          <td><span className='blue-txt fw-5'>{x.code}</span></td>
          <td>Name: <span className='blue-txt fw-5'>{x.name}</span><br/>Contact: {x.contact}<br/>CNIC: {x.cnic}</td>
          <td>Dpt: {x.department}<br/>Designation: {x.designation}<br/>Manager: {x.manager}</td>
          <td>Name: {x.bank}<br/>No: {x.account_no}<br/></td>
          <td>
            Creator: <span className='blue-txt fw-5'>{x.createdBy}</span>
            <br/>
            Modifier: <span className='grey-txt fw-5'>{x.updatedBy==null?'( )':x.updatedBy}</span>
          </td>
          <td>
            <span>
              <EditOutlined className='modify-edit' onClick={()=>{
                setSelectedEmployee(x)
                setEdit(true);
                setVisible(true);
              }} />
            </span>
          </td>
        </tr>
          )
        })}
        </tbody>
        </Table>
        </div>
      </Col>
      </Row>
    </div>
  </div>
  )
}

export default Employees