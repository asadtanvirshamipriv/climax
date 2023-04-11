import React from 'react';
import SEBL from '../Components/Layouts/SE/BL/';
import axios from 'axios';

const seBl = () => {
  return (
    <SEBL />
  )
}

export default seBl

// export async function getServerSideProps({req,res}){



//   return{
//       props: { jobsData:jobsData }
//   }
// }