import React, { useEffect } from 'react'
import { Popover, InputNumber } from "antd";
import SelectComp from '../../../Shared/Form/SelectComp';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import DateComp from '../../../Shared/Form/DateComp';
import TimeComp from '../../../Shared/Form/TimeComp';
import CheckGroupComp from '../../../Shared/Form/CheckGroupComp';
import { Row, Col } from 'react-bootstrap';
import Dates from './Dates';
import InputNumComp from '../../../Shared/Form/InputNumComp';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import moment from 'moment';
import CustomBoxSelect from '../../../Shared/Form/CustomBoxSelect';

const BookingInfo = ({register, control, errors, state, useWatch, dispatch, reset}) => {

  const transportCheck = useWatch({control, name:"transportCheck"});
  const customCheck = useWatch({control, name:"customCheck"});
  const approved = useWatch({control, name:"approved"});
  const Vessel = useWatch({control, name:"Vessel"});

  const filterVessels = (list) => {
    let result = [];
    list.forEach((x)=>{
      result.push({id:x.id, name:x.name+" ~ "+x.code, code:x.code})
    })
    return result
  }
  const filterVoyages = (list, vessel) => {
    let myVessel = list.filter((x)=> { return x.id==vessel })
    console.log(myVessel)
    let result = [];

    myVessel.length>0?
    myVessel[0].Voyages.forEach((x)=>{
      result.push({
        id:x.id,
        name:<Row>
          <Col md={5}>no.</Col>
          <Col md={3}>{x.voyage}</Col>

          <Col md={5}>Arrival</Col>
          <Col md={3}>{moment(x.importArrivalDate).format("DD-MM-YY")}</Col>

          <Col md={5}>Sailing</Col>
          <Col md={3}>{moment(x.importArrivalDate).format("DD-MM-YY")}</Col>
          
          <Col md={5}>Cut-Date</Col>
          <Col md={3}>{moment(x.importArrivalDate).format("DD-MM-YY")}</Col>

          <Col md={5}>Cut-Time</Col>
          <Col md={3}>{moment(x.importArrivalDate).format("DD-MM-YY")}</Col>
        </Row>,
      })
    }):null;
    return result
  }
  const getStatus = (val) => {
    return val.length==0?false:val[0]=="1"?false:true 
  }
  function getWeight(){
    let weight = 0.0;
    let teu = 0;
    let qty = 0;
    state.equipments.forEach((x) => {
      if(x.gross!=''&&x.teu!=''){
        weight = weight + parseFloat(x.gross.replace(/,/g, ''));
        teu = teu + parseInt(x.teu);
        qty = qty + parseInt(x.qty);
      }
    });
    return {weight, teu, qty}
  }

  return (
  <>
    <Row>
      <Col md={2} className=''>
        <div className="">Job No.</div>
        <div className="dummy-input">
          {state.edit?(state.selectedRecord.jobNo):<span style={{color:'white'}}>.</span>}
        </div>
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='jobType' control={control} label='Job Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Direct', name:'Direct'},
            {id:'Coloaded', name:'Coloaded'},
            {id:'Cross Trade', name:'Cross Trade'},
            {id:'Liner Agency', name:'Liner Agency'},
        ]}/>
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='jobKind' control={control} label='Job Kind' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Current', name:'Current'},
            {id:'Opening', name:'Opening'},
          ]}/>
      </Col>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='jobDate' control={control} label='Job Date' width={"100%"} disabled={getStatus(approved)} />
        {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
      <Col md={2} className='py-1'>     
          <DateComp register={register} name='shipDate' control={control} label='Ship Date' disabled={getStatus(approved)} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
      
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='costCenter' control={control} label='Cost Center' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'FSD', name:'FSD'},
            {id:'KHI', name:'KHI'}
          ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='shipStatus' control={control} label='Ship Status:' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Hold', name:'Hold'},
            {id:'Booked', name:'Booked'},
            {id:'Delivered', name:'Delivered'},
            {id:'Shipped', name:'Shipped'},
            {id:'Closed', name:'Closed'}
          ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='subType' control={control} disabled={getStatus(approved) || state.selectedRecord.id!=null} 
        label='Sub Type' width={"100%"}
          options={[  
            {id:'FCL', name:'FCL'},
            {id:'LCL', name:'LCL'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='dg' control={control} label='DG Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'DG', name:'DG'},
            {id:'non-DG', name:'non-DG'},
            {id:'Mix', name:'Mix'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='freightType' control={control} label='Freight Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Prepaid', name:'Prepaid'},
            {id:'Collect', name:'Collect'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='nomination' control={control} label='Nomination' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Free Hand', name:'Free Hand'},
            {id:'Nominated', name:'Nominated'},
            {id:'B2B', name:'B2B'},
        ]} />
      </Col>
    </Row>
    <hr className='my-1' />
    <Row>
      <Col md={3}>
        <SelectSearchComp register={register} name='ClientId' control={control} label='Client' disabled={getStatus(approved)}
          options={state.fields.party.client} />
        <SelectSearchComp register={register} name='shipperId' control={control} label='Shipper' disabled={getStatus(approved)}
          options={state.fields.party.shipper} />
        <SelectSearchComp register={register} name='consigneeId' control={control} label='Consignee' disabled={getStatus(approved)}
          options={state.fields.party.consignee} />

        <SelectSearchComp register={register} name='pol' control={control} label='Port Of Loading' disabled={getStatus(approved)}
          options={ports.ports} />
        <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge' disabled={getStatus(approved)}
          options={ports.ports} />
        <SelectSearchComp register={register} name='fd' control={control} label='Final Destination' disabled={getStatus(approved)}
          options={ports.ports} />
        <SelectSearchComp register={register} name='forwarderId' control={control} label='Forwarder/Coloader' disabled={getStatus(approved)}
          options={state.fields.vendor.forwarder} />
        <SelectSearchComp register={register} name='salesRepresentatorId' control={control} label='Sales Representator' disabled={getStatus(approved)}
          options={state.fields.sr} />
      </Col>
      <Col md={3}>
        <SelectSearchComp register={register} name='overseasAgentId' control={control} label='Overseas Agent' disabled={getStatus(approved)}
          options={state.fields.vendor.overseasAgent} />
        <SelectSearchComp register={register} name='localVendorId' control={control} label='Local Vendor' disabled={getStatus(approved)}
          options={state.fields.vendor.localVendor} />
        <SelectSearchComp register={register} name='shippingLineId' control={control} label='Sline/Carrier' disabled={getStatus(approved)}
          options={state.fields.vendor.sLine} />
        <div className='px-2 pb-2 mt-3' style={{border:'1px solid silver'}}>
        <SelectSearchComp register={register} name='Vessel' control={control} label='Vessel'disabled={getStatus(approved)} width={"100%"}
          options={filterVessels(state.fields.vessel)} />
        <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} name="Voyage" label="Vessel"
        />
        <SelectComp register={register} name='vessel' control={control} label='Voyage'disabled={getStatus(approved)} width={"100%"}
          options={filterVoyages(state.fields.vessel, Vessel)} />
        <div className='my-2'></div>
        <DateComp register={register} name='eta' control={control} label='ETA' disabled={getStatus(approved)} />
        <div className='my-2'></div>
        <DateComp register={register} name='cutOffDate' control={control} label='Cut Off'  disabled={getStatus(approved)} />
        <div className='mt-1'></div>
        <TimeComp register={register} name='cutOffTime' control={control} label=''  width={100} disabled={getStatus(approved)} />
        <Popover content={
            <div className='p-2 m-0' style={{border:'1px solid silver'}}>
              <Dates register={register} control={control} disabled={getStatus(approved)} />
            </div>
          } trigger="click">
          <span className='ex-btn'>Dates</span>
        </Popover>
        </div>
      </Col>
      <Col md={3}>
      <div className=''></div>
      <SelectSearchComp register={register} name='commodityId' control={control} label='Commodity' disabled={getStatus(approved)}
          options={state.fields.commodity} />
          <div className='my-2' />
        <CheckGroupComp register={register} name='transportCheck' control={control} label='' disabled={getStatus(approved)}
          options={[{ label:"Transport", value:"Transport" }]} />
        <SelectSearchComp register={register} name='transporterId' control={control} label='' 
          options={state.fields.vendor.transporter} disabled={getStatus(approved) || transportCheck[0]!='Transport'} />
        <div className='mt-2'></div>
        <CheckGroupComp register={register} name='customCheck' control={control} label='' disabled={getStatus(approved)}
          options={[{ label: "Custom Clearance", value: "Custom Clearance" }]} />
        <SelectSearchComp register={register} name='customAgentId' control={control} label=''
          options={state.fields.vendor.chaChb} disabled={getStatus(approved) || customCheck[0]!='Custom Clearance'} />
        <div style={{marginTop:20}}></div>
        <div className='px-2 pb-2' style={{border:'1px solid silver'}}>
          <Row>
            <Col md={6} className='mt-2'>
            <div>Weight</div><InputNumber value={getWeight().weight} disabled style={{ color:'black'}} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='bkg' control={control} label='BKG Weight' step={'0.01'} disabled={getStatus(approved)} />
            </Col>
            <Col md={12} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled style={{minWidth:200, color:'black'}} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' step={'0.01'} disabled={getStatus(approved)} />
            </Col>
            <Col md={6} className='mt-2'>
              <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{ color:'black'}} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='vol' control={control} label='Vol' step={'0.00001'} disabled={getStatus(approved)}/>
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='pcs' control={control}  label='PCS' disabled={getStatus(approved)} />
            </Col>
          </Row>
        </div>
      </Col>
      <Col md={3}>
        {state.edit &&
          <Notes state={state} dispatch={dispatch} />
        }
        {approved=="approved" && <img src={'approve.png'} height={100} />}
        <CheckGroupComp register={register}name='approved'control={control}label='_____________________' options={[{label:"Approve Job",value:"approved"}]}/>
      </Col>
    </Row>
  </>
)}

export default BookingInfo