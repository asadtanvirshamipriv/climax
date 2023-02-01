import React from 'react';
import Dashboard from '/Components/Layouts/Dashboard';
import axios from 'axios';
import Cookies from 'cookies';

const index = ({sessionData}) => {
  return (
    <div>
      <Dashboard sessionData={sessionData} />
    </div>
  )
}

export default index

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest }
  }
}