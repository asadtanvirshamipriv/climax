import React from 'react';
import InputComp from '../../../Shared/Form/InputComp';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import DateComp from '../../../Shared/Form/DateComp';
import TimeComp from '../../../Shared/Form/TimeComp';
import RadioComp from '../../../Shared/Form/RadioComp';
import { Col, Row, Spinner } from 'react-bootstrap';
import ports from "/jsonData/ports";

const CreateOrEdit = ({state, dispatch, baseValues, register, control, useWatch}) => {

  const type = useWatch({control, name:"type"});

  return (
    <div>
      <h6>Create A Voyage</h6>
      <hr/>
      <Row>
        <Col md={3}>
            <div className=''>Vessel</div>
            <div className='dummy-input '>{state.selectedRecord.name}</div>
        </Col>
        <Col md={3}>
        <InputComp register={register} name='voyage' control={control} label='Voyage #' width={150} />
        </Col>
        <Col md={6}></Col>
        <Col md={3}>
        <SelectSearchComp register={register} name='pol' control={control} label='POL' width={'100%'}
          options={ports.ports}/>
        </Col>
        <Col md={3}>
        <SelectSearchComp register={register} name='pod' control={control} label='POD' width={'100%'}
          options={ports.ports}/>
        </Col>
        <Col md={12}><hr className='my-2' />
            <b>Actual :</b>
            <hr className='my-2' />
            <Row className='mt-3' >
                <Col md={2} className='py-3'><b>Import :</b></Col>
                <Col md={3} >
                    <DateComp register={register} name='importOriginSailDate' control={control} label='Origin Sailing Date' width={150} 
                        disabled={type=="Export"?true:false} 
                    />
                </Col>
                <Col md={3} >
                    <DateComp register={register} name='importArrivalDate' control={control} label='Arrival Date' width={150} 
                        disabled={type=="Export"?true:false} 
                    />
                </Col>
            </Row>
            <hr className='my-2' />
            <Row className='mt-3' >
                <Col md={2} className='py-3'><b>Export :</b></Col>
                <Col md={3} >
                    <DateComp register={register} name='exportSailDate' control={control} label='Sailing Date' width={150}
                        disabled={type!="Export"?true:false}  
                    />
                </Col>
                <Col md={3} >
                    <DateComp register={register} name='destinationEta' control={control} label='Destination ETA' width={150} 
                        disabled={type!="Export"?true:false} 
                    />
                </Col>
                <Col md={3} className='my-3 py-3'></Col>
                <Col md={2} className='my-3 py-3'></Col>
                <Col md={3} >
                    <DateComp register={register} name='cutOffDate' control={control} label='Cut-Off Date' width={150} 
                        disabled={type!="Export"?true:false}
                    />
                </Col>
                <Col md={3} >
                    <TimeComp register={register} name='cutOffTime' control={control} label='Cut-Off Time' width={150} 
                        disabled={type!="Export"?true:false}
                    />
                </Col>
            </Row>
            <hr/>
            <RadioComp register={register} name='type' control={control} label='Calculation Type'
                options={[
                    { label: "Import", value: "Import" },
                    { label: "Export", value: "Export" },
                ]}
            />
        </Col>
      </Row>
      <button type="submit" className='btn-custom'>
      {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
    </button>
    </div>
  )
}

export default CreateOrEdit
