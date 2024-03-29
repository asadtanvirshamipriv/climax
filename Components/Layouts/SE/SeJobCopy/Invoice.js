import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceCharges from '../../../Shared/InvoiceCharges';
import { Spinner } from 'react-bootstrap';

const Invoice = ({state, dispatch, companyId}) => {

    const [load, setLoad] = useState(false);

    useEffect(() => {
      getData();
      return () => { }
    }, [state.selectedInvoice])
    
    const getData = async() => {
        setLoad(true);
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_NO, {
            headers:{"invoice_No": `${state.selectedInvoice}`}
        }).then((x)=>{
            setLoad(false);
            dispatch({type:'toggle', fieldName:'invoiceData', payload:x.data.result});
        })
    }

  return (
    <div style={{minHeight:680}}>
        {!load && 
            <InvoiceCharges data={state.invoiceData} companyId={companyId} />
        }
        {load && 
        <div style={{textAlign:"center", paddingTop:'30%'}}>
            <Spinner />
        </div>
        }
    </div>
  )
}

export default Invoice