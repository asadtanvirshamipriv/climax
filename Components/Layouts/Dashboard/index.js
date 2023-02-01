import React, { useEffect } from 'react';
import Router from 'next/router';

const Dashboard = ({sessionData}) => {

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
  }, [sessionData]);

  return (
    <div>
      Add & Select Tabs to get started
    </div>
  )
}

export default Dashboard