import { Row, Col } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';

const Gl = ({state, dispatch}) => {

  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) => a.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

  useEffect(() => {
    console.log(state.transactionCreation);
  }, [state])

  return (
    <>
    <Modal title={`Transaction General Journal`} open={state.glVisible} 
        onOk={()=>set('glVisible', false)}
        onCancel={()=>set('glVisible', false)}
        footer={false} maskClosable={false}
        width={'80%'}
    >
        <div style={{minHeight:300}}>
        <Row style={{borderRight:'1px solid grey', borderTop:'1px solid grey'}}>
            <Col md={2} className="gl-col-lines text-center"><h6>Date</h6></Col>
            <Col md={6} className="gl-col-lines text-center"><h6>Particulars</h6></Col>
            <Col md={2} className="gl-col-lines text-center"><h6>Debit</h6></Col>
            <Col md={2} className="gl-col-lines text-center"><h6>Credit</h6></Col>
            {state.transactionCreation.recievable.exists &&
            <>
              {/* Main Recivable Entry */}
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-5'>
                    {state.transactionCreation.recievable.debit.title}
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-5'>
                    {state.transactionCreation.recievable.credit.name} {"("}A/c{")"}
                  </h6>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-2">
                  <h6>
                    <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.recievable.amount)}
                  </h6>
                  <hr/>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-1">
                  <br/>
                  <hr/>
                  <h6>
                  <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.recievable.amount)}
                  </h6>
                </Col>
              </>
              {/* Tax Entry */}
              {state.transactionCreation.salesTax.exists &&
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                  </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-5'>
                    {state.transactionCreation.salesTax.debit.title}
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-5'>
                    {state.transactionCreation.salesTax.credit.title} 
                  </h6>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-2">
                  <h6>
                  <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.salesTax.amount)}
                  </h6>
                  <hr/>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-1">
                  <br/>
                  <hr/>
                  <h6>
                  <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.salesTax.amount)}
                  </h6>
                </Col>
              </>
              }
              {/* Bank Charges Entry */}
              {state.transactionCreation.bankCharges.exists &&
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                  </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-5'>
                    {state.transactionCreation.bankCharges.debit.title}
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-5'>
                    {state.transactionCreation.bankCharges.credit.title} 
                  </h6>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-2">
                  <h6>
                  <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.bankCharges.amount)}
                  </h6>
                  <hr/>
                </Col>
                <Col md={2} className="gl-col-lines text-end py-1">
                  <br/>
                  <hr/>
                  <h6>
                  <span className='gl-curr-rep'>Rs.{" "}</span>{commas(state.transactionCreation.bankCharges.amount)}
                  </h6>
                </Col>
              </>
              }
            </>
            }
        </Row>
    </div>
    </Modal>
    </>
  )
}

export default Gl