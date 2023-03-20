import React from 'react';
import AccountActivity from '../../Components/Layouts/Reports/AccountActivity';
import axios from 'axios';

const accountActivity = ({childAccounts}) => {
  return (
    <AccountActivity childAccounts={childAccounts} />
  )
}

export default accountActivity

export async function getServerSideProps({req,res}){

  const childAccounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS).then((x)=>x.data);


  return{
      props: { childAccounts }
  }
}