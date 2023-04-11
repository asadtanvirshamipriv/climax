import { CheckCircleOutlined } from "@ant-design/icons";
import { Spinner, Table } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Tag } from 'antd';
import moment from "moment";

const PartySearch = ({state, useWatch, dispatch, control}) => {

    const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
    useEffect(() => {
      console.log(state.jobsData)
    }, [state.jobsData])
    
  return (
    <div style={{minHeight:250}}>
      {state.jobLoad && <div className='center' style={{paddingTop:'15%'}}><Spinner /></div>}
      {!state.jobLoad &&
        <div className='table-sm-1 mt-4' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead'>
            <thead>
            <tr>
                <th className='text-center'>#</th>
                <th className='text-center'>Job No.</th>
                <th className='text-center'>Date</th>
                <th className='text-center'>Client</th>
                <th className='text-center'>Sailing Date</th>
                <th className='text-center'>POL</th>
                <th className='text-center'>POD</th>
            </tr>
            </thead>
            <tbody>
            {state.jobsData.map((x, i)=> {
            return(
            <tr key={i} className={` ${x.check?"table-select-list-selected":"table-select-list"}`}
              onClick={()=>{
                if(!x.check){
                    let temp = [...state.jobsData];
                    temp.forEach((y, i2)=>{
                      if(y.jobNo==x.jobNo){ temp[i2].check=true
                      } else { temp[i2].check=false }
                    })
                    set('jobData', temp);
                    //dispatch({type:'toggle', fieldName:props.type=="vendors"?'vendorParties':'clientParties', payload:temp});
                }else{
                    console.log("else")
                }
              }}
            >
              <td className=' text-center px-3'>
                {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 }
              </td>
              <td className=' text-center' style={{whiteSpace:"nowrap"}}><strong>{x.jobNo}</strong></td>
              <td className=' text-center' style={{fontSize:12}}>{moment(x.jobDate).format("DD-MM-YYYY")}</td>
              <td className='pt-1 text-center'>{x.Client.name}</td>
              <td className='pt-1 text-center' style={{fontSize:12}}>{moment(x.shipDate).format("DD-MM-YYYY")}</td>
              <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.pol}</Tag></td>
              <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.pod}</Tag></td>
            </tr>
            )
          })}
            </tbody>
        </Table>
        </div>
      }
    </div>
  )
}

export default PartySearch
