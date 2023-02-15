import React, { useEffect, useState } from 'react';
import axios from 'axios';
import openNotification from '../../../Shared/Notification';
import { Empty } from 'antd';
import { Spinner } from 'react-bootstrap';
import { delay } from '../../../../functions/delay';

const BillComp = ({selectedParty, payType}) => {

    const [invocies, setInvoices] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        getInvoices(selectedParty.id);
        return () => { 
            console.log("Clean Up Function!")
        } 
    }, [selectedParty, payType])

    const getInvoices = async(id) => {
        setLoad(true);
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, { 
            headers:{id:id, pay:payType}
         }).then(async(x)=> {
            setInvoices(x.data.result);
            await delay(2000)
            setLoad(false);
        })
    }
    
  return (
    <>
    {!load && 
    <>
        {invocies.length==0 && <Empty/> }
        
    </>
    }
    {load && <div className='text-center' ><Spinner /></div>}
    </>
  )
}

export default BillComp
