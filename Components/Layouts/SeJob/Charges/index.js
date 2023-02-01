import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Tabs } from 'antd';
import ChargesList from './ChargesList';

const Charges = ({state, dispatch}) => {

  useEffect(() => {
    calculateCharge(state.paybleCharges, 'payble')
    calculateCharge(state.reciveableCharges, 'reciveable')
  }, [state.paybleCharges, state.reciveableCharges])

  const calculateCharge = (chargesList, chargeType) => {
    let ccCharges = 0;
    let ppCharges = 0;
    let tax = 0;

    if(chargesList.length!=0){
      if(chargesList.length>0){
        chargesList.forEach(x => {
          if(x.pp_cc=="CC"){
            ccCharges = ccCharges + parseFloat(x.local_amount);
          }else if(x.pp_cc=="PP"){
            ppCharges = ppCharges + parseFloat(x.local_amount);
          }
          if(x.tax_apply=="Yes"){
            tax = tax + parseFloat(x.tax_amount*x.ex_rate);
          }
        });
      }
    }
    dispatch({type:'toggle', fieldName:chargeType, 
      payload:{
        pp:ppCharges.toFixed(2),
        cc:ccCharges.toFixed(2),
        total:(ppCharges+ccCharges).toFixed(2),
        tax:(tax).toFixed(2)
      }
    });

  }
//chargesTab
  return (
    <>
    <div style={{minHeight:525, maxHeight:525}}>
    <Tabs defaultActiveKey="1" onChange={(e)=> dispatch({type:'toggle', fieldName:'chargesTab',payload:e})}>
      <Tabs.TabPane tab="Recievable" key="1">
        {/* <RecivableCharges state={state} dispatch={dispatch} /> */}
        <ChargesList state={state} dispatch={dispatch} chargeType={state.reciveableCharges}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Payble" key="2">
        {/* <PaybleCharges state={state} dispatch={dispatch} /> */}
        <ChargesList state={state} dispatch={dispatch} chargeType={state.paybleCharges}/>
      </Tabs.TabPane>
    </Tabs>
    <hr/>
    </div>
    <div className='px-3'>
    <Row className='charges-box' >
      <Col md={9}>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Recievable:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Payble:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.payble.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.payble.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.payble.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.payble.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
      </Col>
      <Col md={2} className="py-4">
        <div className='text-center mt-3'>Net</div>
        <div className="field-box p-1 text-end">
          {(state.reciveable.total-state.payble.total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </Col>
    </Row>
    </div>
    </>
  )
}

export default Charges