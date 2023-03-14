import { useForm, useWatch, useFormContext } from "react-hook-form";
import CheckGroupComp from '../../Shared/Form/CheckGroupComp';
import openNotification from '../../Shared/Notification';
import SelectComp from '../../Shared/Form/SelectComp';
import { yupResolver } from "@hookform/resolvers/yup";
import InputComp from '../../Shared/Form/InputComp';
import { Row, Col, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import * as yup from "yup";
import axios from 'axios';

const CreateOrEdit = ({state, dispatch, baseValues}) => {

    const SignupSchema = yup.object().shape({
        name: yup.string().required('Required'),
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(SignupSchema),
        defaultValues:state.values
    });

    useEffect(() => {
        if(state.edit){
            console.log(state.selectedRecord);
            let tempRecord = {...state.selectedRecord};
            delete tempRecord.isHazmat;
            tempRecord.isHazmat = state.selectedRecord.isHazmat==1?['hazmat']:[];
            console.log(tempRecord);
            reset(tempRecord);
        }else{
            reset(baseValues)
        }
    }, [state.selectedRecord])

    const isHazmat = useWatch({control, name:"isHazmat"});

    const onSubmit = async(data) => {
        dispatch({type:'toggle', fieldName:'load', payload:true});
        console.log(data);
        setTimeout(async() => {             
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_COMMODITY,{
                data
            }).then((x)=>{
                console.log(x.data)
                if(x.data.status!='success'){
                    openNotification('Error', `Error Occured Try Again!`, 'red')
                }else{
                    openNotification('Success', `Commodity Created!`, 'green');
                    let tempRecord = [...state.records];
                    console.log(x.data.result)
                    tempRecord.unshift(x.data.result);
                    dispatch({type:'toggle', fieldName:'records', payload:tempRecord});
                    dispatch({ type: 'modalOff' })
                }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
         }, 3000);
    };

    const onEdit = async(data) => {
        console.log('edit')
        dispatch({type:'toggle', fieldName:'load', payload:true});
        //console.log(data);
        setTimeout(async() => {             
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_COMMODITY,{
                data
            }).then((x)=>{
                console.log(x.data)
                if(x.data.status=='exists'){
                    openNotification('Error', `Same Code Already Exists!`, 'red')
                }else{
                    openNotification('Success', `Commodity Updated!`, 'green');

                    let tempRecords = [...state.records];
                    let i = tempRecords.findIndex((y=>data.id==y.id));
                    tempRecords[i] = x.data.result;
                    dispatch({type:'toggle', fieldName:'records', payload:tempRecords});
                    dispatch({ type: 'modalOff' })
                }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
         }, 3000);
    };
    const onError = (errors) => console.log(errors);

  return (
    <div className='client-styles' style={{maxHeight:720, overflowY:'auto', overflowX:'hidden'}}>
      <h6>{state.edit?'Edit':'Create'}</h6>
      <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
        <Row>
            <Col md={6} className='py-1'>
                <InputComp  register={register} name='name' control={control} label='Name' />
                {errors.name && <div className='error-line'>{errors.name.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp  register={register} name='hs' control={control} label='HS Code' />
            </Col>
            <Col md={7} className='py-1'>
                <SelectComp register={register} name='cargoType' control={control} label='Cargo Type' width={220}
                    options={[
                        {id:"GL", name:"GL"},
                        {id:"CAR", name:"CAR"}
                    ]} />
            </Col>
            <Col md={7} className='py-1'>
                <SelectComp register={register} name='commodityGroup' control={control} label='Commodity Group' width={220}
                    options={[
                        {id:"Live Stock", name:"Live Stock"},
                        {id:"Raw Material", name:"Raw Material"}
                    ]} />
            </Col>
        </Row>
        <Row>
            <Col md={12} className="my-2">Hazmat Details</Col>
            <hr/>
            <Col md={12} className='py-1'>     
                <CheckGroupComp register={register} name='isHazmat' control={control} label='Hazmat Product?' 
                    options={[
                        {label:"Yes", value:"hazmat"}
                    ]} />
            </Col>
            <Col md={3} className='py-1'>
                <SelectComp register={register} name='packageGroup' disabled={isHazmat[0]=="hazmat"?false:true} control={control} label='Packaging Group'
                    width={220}
                    options={[
                        {id:"GRP 1", name:"GRP 1"},
                        {id:"GRP 2", name:"GRP 2"},
                        {id:"GRP 3", name:"GRP 3"},
                    ]} />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp  register={register} name='hazmatCode' disabled={isHazmat[0]=="hazmat"?false:true} control={control} label='Hazmat Code' />
            </Col>
            <Col md={6}></Col>
            <Col md={3} className='py-1'>
                <SelectComp register={register} name='hazmatClass' disabled={isHazmat[0]=="hazmat"?false:true} control={control} label='Hazmat Class'
                    width={220}
                    options={[
                        {id:"Class 1", name:"Class 1"},
                        {id:"Class 2", name:"Class 2"},
                        {id:"Class 3", name:"Class 3"},
                    ]} />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp  register={register} name='chemicalName' disabled={isHazmat[0]=="hazmat"?false:true} control={control} label='Chemical Name' />
            </Col>
            <Col md={6}></Col>
            <Col md={3} className='py-1'>
                <InputComp  register={register} name='unoCode' disabled={isHazmat[0]=="hazmat"?false:true} control={control} label='UNO Code' />
            </Col>
        </Row>
        <button type="submit" disabled={state.load?true:false} className='btn-custom mt-4'>
            {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
        </button>
      </form>
    </div>
  )
}

export default CreateOrEdit