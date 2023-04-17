import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { useForm, useWatch } from "react-hook-form";

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
            visible: true
        }
      }
      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            selectedRecord:{},
            edit: true,
            visible: true,
            selectedRecord:action.payload
        }
      }
      case 'modalOff': {
        let returnVal = {
          ...state,
          visible: false,
          edit: false
        };
        state.edit?returnVal.selectedRecord={}:null
        return returnVal
      }
      default: return state 
    }
}
const baseValues = {
  pol:"",
  pod:"",
  voyage:"",
  importOriginSailDate:"",
  importArrivalDate:"",
  exportSailDate:"",
  destinationEta:"",
  cutOffDate:"",
  cutOffTime:"",
  type:"Export",
  vesselId:""
}

const initialState = {
    records: [],
    voyagerecords: [],
    load:false,
    visible:false,
    edit:false,
    values:baseValues,
    selectedRecord:{},
    selectedId:'',
};

const Voyage = ({vesselsData}) => {
    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});

    const {register, control, handleSubmit, reset, formState:{errors} } = useForm({
        defaultValues:state.values
      });

    const findVoyages = async(data) => {
        set('load', true);
        set('selectedRecord', data);
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_FIND_ALL_VOYAGES,{id:data.id})
        .then((x)=>{
            set('voyagerecords', x.data.result);
        });
        set('load', false);
    }
    useEffect(() => { set('records', vesselsData) }, [])
    useEffect(() => { console.log(state.selectedRecord) }, [state.selectedRecord])
    const onSubmit = async(data) => {
        console.log(data)

    };
    const onEdit = async(data) => {

    };
    
    const onError = (errors) => console.log(errors);
  return (
    <div className='base-page-layout'>
    
    <Row><Col><h5>Sea Export Job</h5></Col></Row>
    <hr/>
    <Row>
    <Col md={4}>
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead><tr><th>Sr.</th><th>Code</th><th>Name</th></tr></thead>
        <tbody>
        {
        state.records.map((x, index) => {
        return (
        <tr key={index} className='f row-hov' onClick={()=>findVoyages(x)} >
          <td>{index + 1}</td>
          <td className='blue-txt fw-7'> {x.code}</td>
          <td style={{minWidth:150}}>
            <div style={{fontSize:14,lineHeight:1}}>{x.name}</div>
            <div style={{fontSize:12,color:'grey'}}>{x.carrier}</div>
          </td>
        </tr>
        )})}
        </tbody>
        </Table>
      </div>
    </Col>
    <Col md={8}>
        <div className='border p-2 mt-3' style={{minHeight:100}}>
        {Object.keys(state.selectedRecord).length==0 &&<div className='text-center my-4'>Select A Vessel</div>}
        {Object.keys(state.selectedRecord).length>0 &&<>
        {!state.load && 
        <Row>
            <Col md={12}>
             <button className='btn-custom'  onClick={()=>dispatch({type:'create'})}>Create</button>
                <hr className='my-0 mt-1'  />
            </Col>
         {state.voyagerecords.length==0 && <div className='text-center my-5'>Empty</div>}
        </Row>
        }
        </>}
        {state.load && <div className='text-center py-5'><Spinner  /></div>}
        </div>
    </Col>
    </Row>
    <Modal
        open={state.visible} maskClosable={false}
        onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
        width={800} footer={false} //centered={true}
    >
        {state.visible && 
        <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
        <CreateOrEdit 
            state={state} 
            dispatch={dispatch} 
            baseValues={baseValues} 
            register={register} 
            control={control} 
            useWatch={useWatch} 
        />
        </form>
        }
    </Modal>

    
    </div>
  )
}
export default Voyage