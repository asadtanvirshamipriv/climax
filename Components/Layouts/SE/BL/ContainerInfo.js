import React, { useEffect } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { DatePicker, Input, InputNumber, Select } from 'antd';
import { CloseCircleOutlined } from "@ant-design/icons";
import { calculateContainerInfos } from './states';

const ContainerInfo = ({control, register, state, useWatch, dispatch, reset}) => {
  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});

  const allValues = useWatch({control})

  const onChange = (e, i, variable, type) => {
    let temp = [...state.Container_Infos];
    temp[i][variable] = type=='e'?e:e.target.value;
    set('Container_Infos', temp)
  }

  const confirmClose = (index, id) => {
    let temp = [...state.Container_Infos];
    if(id!==null){
        console.log(id);
        let tempDeleteList = [...temp];
        temp = temp.filter((x)=>{
          console.log(x.id, id)
            return x.id!==id
        })
        console.log(temp)
        tempDeleteList = tempDeleteList.filter((x)=>{
            return x.id==id
        })
        set('deletingContinersList', tempDeleteList)
    }else{
        let newTemp = temp;
        temp = [];
        newTemp.forEach((x, i)=>{
            if(i!=index){
                temp.push(x)
            }
        })
    }
    set('Container_Infos', temp)
  }

  const weightOpt = [
    {label:'40HC', value:'40HC'},
    {label:'20HC', value:'20HC'},
    {label:'30HC', value:'30HC'}
  ]
  const weightUnit = [
    {label:'KG', value:'KG'},
    {label:'LBS', value:'LBS'},
    {label:'MTON', value:'MTON'}
  ]
  const PackagrUnits = [
    {label:'BAGS', value:'BAGS'},
    {label:'BALES', value:'BALES'},
    {label:'BARRELS', value:'BARRELS'}
  ]
  const loadType = [
    {label:'FULL', value:'FULL'},
    {label:'EMPTY', value:'EMPTY'}
  ]
  const dgTypes = [
    {label:'DG', value:'DG'},
    {label:'non-DG', value:'non-DG'}
  ]
  useEffect(()=>{ set('saveContainers',true); },[state.Container_Infos])

return (
<div style={{height:600}}>
<Row>
<Col md={2}>
    <div className='div-btn-custom text-center py-1' 
        onClick={()=>{
            let temp = [...state.Container_Infos];
            temp.push({
                id:null,
                no:'1',
                seal:'',
                size:'',
                rategroup:'',
                gross:'',
                net:'',
                tare:'',
                wtUnit:'',
                cbm:'',
                pkgs:'',
                unit:'',
                temp:'',
                loadType:'',
                remarks:'',
                detention:'',
                demurge:'',
                plugin:'',
                dg:'',
                number:'',
                date:'',
                top:'',
                right:'',
                left:'',
                front:'',
                back:''
            })
            set('Container_Infos', temp)
        }}
    >Add Row</div>
</Col>
<Col md={2}>
    {state.saveContainers &&<div className='div-btn-custom-green text-center py-1' 
        onClick={()=>calculateContainerInfos(state, set, reset, allValues)}
    >Save</div>}
</Col>
<Col md={12}>
<div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
<Table className='tableFixHead' bordered>
    <thead className=''>
    <tr className='table-heading-center no-lineBr'>
    <th></th>
    <th>Sr.</th>
    <th>Container #</th>
    <th>Seal</th>
    <th>Size</th>
    <th>Rate group</th>
    <th>Gross Wt</th>
    <th>Net Wt</th>
    <th>Tare Wt</th>
    <th>WT Unit</th>
    <th>CBM</th>
    <th>Packages</th>
    <th>Unit</th>
    <th>Temperature</th>
    <th>load Type</th>
    <th>Remarks</th>
    <th>Detention</th>
    <th>Demurge</th>
    <th>Plugin</th>
    <th>DG Type</th>
    <th>Number</th>
    <th>Date</th>
    <th>top</th>
    <th>right</th>
    <th>left</th>
    <th>front</th>
    <th>back</th>
    </tr>
    </thead>
    <tbody>
    {state.Container_Infos.map((x,i)=>{
    return (
    <tr key={i} className='f table-row-center-singleLine'>
    <td className='text-center p-0 px-2'>
    <CloseCircleOutlined className='close-btn' 
        style={{fontSize:12, position:'relative', bottom:2}}
        onClick={()=>confirmClose(i, x.id)}
    />
    </td>
    <td className='text-center p-0'>{i + 1}</td>
    <td className='p-0'><Input  value={x.no}         style={{width: 120  }} size='small' onChange={(e)=>onChange(e,i,'no'          )}   /></td>
    <td className='p-0'><Input  value={x.seal}       style={{width: 65   }} size='small' onChange={(e)=>onChange(e,i,'seal'        )}   /></td>
    <td className='p-0'><Select value={x.size}       style={{width: 75   }} size='small' onChange={(e)=>onChange(e,i,'size','e'    )} options={weightOpt}/></td>
    <td className='p-0'><Input  value={x.rategroup}  style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'rategroup'   )}    /></td>
    <td className='p-0'><InputNumber value={x.gross} style={{width: 79   }} size='small' onChange={(e)=>onChange(e,i,'gross','e')} min="0.01"/></td>
    <td className='p-0'><InputNumber value={x.net}   style={{width: 79   }} size='small' onChange={(e)=>onChange(e,i,'net','e')}   min="0.01"/></td>
    <td className='p-0'><InputNumber value={x.tare}  style={{width: 79   }} size='small' onChange={(e)=>onChange(e,i,'tare','e')}  min="0.01"/></td>
    <td className='p-0'><Select value={x.wtUnit}     style={{width: 80   }} size='small' onChange={(e)=>onChange(e,i,'wtUnit','e'  )} options={weightUnit}/></td>
    <td className='p-0'><InputNumber value={x.cbm}   style={{width: 70   }} size='small' onChange={(e)=>onChange(e,i,'cbm','e'  )} min="0.01"/></td>
    <td className='p-0'><InputNumber value={x.pkgs}  style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'pkgs','e')}  min="0.01"/></td>
    <td className='p-0'><Select value={x.unit}       style={{width: 100  }} size='small' onChange={(e)=>onChange(e,i,'unit','e'    )} options={PackagrUnits}/></td>
    <td className='p-0'><Input  value={x.temp}       style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'temp'        )}    /></td>
    <td className='p-0'><Select value={x.loadType}   style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'loadType','e')}options={loadType}/></td>
    <td className='p-0'><Input  value={x.remarks}    style={{width: 200  }} size='small' onChange={(e)=>onChange(e,i,'remarks'     )}    /></td>
    <td className='p-0'><Input  value={x.detention}  style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'detention'   )}    /></td>
    <td className='p-0'><Input  value={x.demurge}    style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'demurge'     )}    /></td>
    <td className='p-0'><Input  value={x.plugin}     style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'plugin'      )}    /></td>
    <td className='p-0'><Select value={x.dg}         style={{width: 80   }} size='small' onChange={(e)=>onChange(e,i,'dg','e'      )}options={dgTypes}/></td>
    <td className='p-0'><Input  value={x.number}     style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'number'      )}    /></td>
    <td className='p-0'><DatePicker value={x.date}   style={{width: 130  }} size='small' onChange={(e)=>onChange(e,i,'date','e'    )}    /></td>
    <td className='p-0'><Input  value={x.top}        style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'top'         )}    /></td>
    <td className='p-0'><Input  value={x.right}      style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'right'       )}    /></td>
    <td className='p-0'><Input  value={x.left}       style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'left'        )}    /></td>
    <td className='p-0'><Input  value={x.front}      style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'front'       )}    /></td>
    <td className='p-0'><Input  value={x.back}       style={{width:'100%'}} size='small' onChange={(e)=>onChange(e,i,'back'        )}    /></td>
    </tr>)})}
    </tbody>
</Table>
</div>
</Col>
</Row>
</div>
)}
export default ContainerInfo