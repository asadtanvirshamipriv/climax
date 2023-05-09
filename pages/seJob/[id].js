import React from 'react';
//import { useRouter } from 'next/router';
import axios from "axios";
import SeJobCopy from '../../Components/Layouts/SE/SeJobCopy';

const seJob = ({jobData, id, fieldsData}) => {
  return (
    <SeJobCopy jobData={jobData} id={id} fieldsData={fieldsData} />
  )
}
export default seJob

export async function getStaticProps(context) {
    const { params } = context;
    let jobData = {};
    const fieldsData = await fetch(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_VALUES).then((x)=>x.json());
    
    if(params.id!="new"){
      jobData = await fetch(process.env.NEXT_PUBLIC_CLIMAX_GET_SE_JOB_BY_ID,{
        headers:{ "id": `${params.id}` }
      }).then((x)=>x.json());//.then((x)=>x.data.result);
    
      if (!jobData.result.id) {
        return {
          notFound: true
        }
      }
    }
    // return {
    //   props: { jobData:jobData.result, id:params.id, fieldsData:fieldsData,  }
    // }
    return {
      props: { 
        jobData:jobData.result, id:params.id, fieldsData:fieldsData
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    };
  }
  
export async function getStaticPaths() {
  const response = await fetch(process.env.NEXT_PUBLIC_CLIMAX_GET_SE_JOBS_IDS);
  //console.log(response, "Over Here")
  const data = await response.json();
  const paths = data.result.map(x => {
    return {
      params: { id: `${x.id}` }
    }
  })

  return { paths, fallback: 'blocking' };
}