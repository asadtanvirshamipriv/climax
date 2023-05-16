import React from 'react';
import Cookies from 'cookies';
import SEJobList from '../Components/Layouts/SE/SEJobList';

export default ({sessionData, jobsData}) => <SEJobList sessionData={sessionData} jobsData={jobsData} />

export async function getServerSideProps({req,res}){

  const cookies = new Cookies(req, res);
  const sessionRequest = await fetch(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.json());

  const jobsData = await fetch(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SEAJOB, {
    headers:{ companyid: `${cookies.get('companyId')}`}
  }).then((x)=>x.json());

  return {
    props: {
      sessionData:sessionRequest,
      jobsData:jobsData
    }
  }
}