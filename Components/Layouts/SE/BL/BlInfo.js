import React, { useState } from 'react';
import InputNumComp from '/Components/Shared/Form/InputNumComp';
import InputComp from '/Components/Shared/Form/InputComp';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import { Row, Col } from 'react-bootstrap';
import { Modal } from 'antd';
import PartySearch from './PartySearch';
import { fetchJobsData } from './states';
import { delay } from '../../../../functions/delay';

const BlInfo = ({control, register, errors, state, useWatch, dispatch}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b})

  return (
    <>
    <Row>
        <Col md={2}>
            <div className="">Job No.</div>
                <div className='dummy-input' onClick={()=>fetchJobsData(set)}>
                </div>
            {/*<SelectSearchComp register={register}name='ClientId'control={control}label='Client'options={state.fields.party.client}/>*/}
        </Col>
        {/* <InputComp register={register} name='jobType' control={control} label='Job Type' width={150} /> */}
        
    </Row>
    <Modal
        open={state.partyVisible} maskClosable={false}
        onOk={()=>set('partyVisible', false)} 
        onCancel={()=>set('partyVisible', false)}
        
        width={800} footer={false} //centered={true}
    >
        <PartySearch state={state} useWatch={useWatch} dispatch={dispatch} control={control} />    
    </Modal>
    </>
  )
}

export default BlInfo
