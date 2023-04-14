import React from 'react';
import SEBL from '../Components/Layouts/SE/BL/';
import axios from 'axios';

const seBl = ({partiesData}) => {
  return (
    <SEBL partiesData={partiesData} />
  )
}

export default seBl

export async function getServerSideProps({req,res}){

  const partiesData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFY_PARTIES)
  .then((x)=>x.data.result)

  return{
      props: { partiesData:partiesData }
  }
}