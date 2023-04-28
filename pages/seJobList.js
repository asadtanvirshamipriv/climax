import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import SeJob from '../Components/Layouts/SE/SeJob/';

const seJobList = ({fieldsData, sessionData, jobsData}) => {
  return (
    <SeJob sessionData={sessionData} fieldsData={fieldsData} jobsData={jobsData} />
  )
}
export default seJobList

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const fieldsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_VALUES).then((x)=>x.data);
  const jobsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SEAJOB, {
    headers:{ companyid: `${cookies.get('companyId')}`}
  }).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, fieldsData:fieldsData, jobsData:jobsData }
  }
}