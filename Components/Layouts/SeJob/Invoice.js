import React, { useEffect } from 'react';
import axios from 'axios';
import InvoiceCharges from '../../Shared/InvoiceCharges';

const Invoice = ({state, dispatch}) => {

    useEffect(() => {
        getData();
    }, [state.selectedInvoice])

    const getData = async() => {
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_NO,{
            headers:{"invoice_No": `${state.selectedInvoice}`}
        }).then((x)=>{
            //console.log(x.data)
            dispatch({type:'toggle', fieldName:'invoiceData', payload:x.data.result})
        })
    }

  return (
    <div style={{minHeight:680}}>
        <InvoiceCharges data={state.invoiceData} />
    </div>
  )
}

export default Invoice
