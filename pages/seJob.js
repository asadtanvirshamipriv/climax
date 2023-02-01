import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import SeJob from '../Components/Layouts/SeJob';

const seJob = ({fieldsData, sessionData, jobsData}) => {
  return (
    <SeJob sessionData={sessionData} fieldsData={fieldsData} jobsData={jobsData} />
  )
}
export default seJob

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const fieldsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_VALUES).then((x)=>x.data);
  const jobsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SEAJOB).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, fieldsData:fieldsData, jobsData:jobsData }
  }
}