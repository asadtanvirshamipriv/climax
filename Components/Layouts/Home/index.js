import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import Accounts from './Accounts';

const Home = ({sessionData}) => {

  const [userType, setUserType] = useState("");
  useEffect(() => { setUserType(JSON.parse(Cookies.get("access")).split(", ")[0]) }, [])

  return (
    <div className='base-page-layout'>
    <Row>
      <Col md={12}>
        {userType=="accounts"?<Accounts/>:null}
      </Col>
    </Row>
    </div>
  )
}

export default Home