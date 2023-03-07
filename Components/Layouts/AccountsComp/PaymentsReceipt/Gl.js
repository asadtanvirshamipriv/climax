import { Row, Col, Table } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons"

const Gl = ({state, dispatch}) => {

  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) =>  { return a.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}


  const getTotal = (type) => {
    let result = 0.00;
    state.transactionCreation.forEach((x)=>{
      if(type==x.tran.type){
        result = result + x.tran.amount
      }
    })
    return result;
  }

  return (
    <>
    <Modal title={`Transaction General Journal`} open={state.glVisible} 
        onOk={()=>set('glVisible', false)}
        onCancel={()=>set('glVisible', false)}
        footer={false} maskClosable={false}
        width={'60%'}
    >
    <div style={{minHeight:400}}>
      <div className='table-sm-1 mt-3' style={{maxHeight:400, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
          <thead>
              <tr>
                  <th className='text-center' style={{width:250}}>Particular</th>
                  <th className='text-center' style={{width:25}}>Debit</th>
                  <th className='text-center' style={{width:25}}>Credit</th>
              </tr>
          </thead>
          <tbody>
          {state.transactionCreation.map((x, index) => {
          return (
              <tr key={index}>
                  <td>{x.particular}</td>
                  <td className='text-end'>{x.tran.type!="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
                  <td className='text-end'>{x.tran.type=="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
              </tr>
              )
          })}
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Balance</td>
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('debit'))}</td>
                <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('credit'))}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
    </Modal>
    </>
  )
}

export default Gl

/*
        <Row style={{borderRight:'1px solid grey', borderTop:'1px solid grey'}}>
            <Col md={2} className="gl-col-lines text-center"><h6>Date</h6></Col>
            <Col md={6} className="gl-col-lines text-center"><h6>Particulars</h6></Col>
            <Col md={2} className="gl-col-lines text-center"><h6>Debit</h6></Col>
            <Col md={2} className="gl-col-lines text-center"><h6>Credit</h6></Col>
            {state.transactionCreation.recievable.exists &&
            <>
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-1'>
                    {state.transactionCreation.recievable.debit.title}
                    {state.transactionCreation.recievable.debit.Parent_Account.Account.inc=="credit" &&
                    <span className='acc-rec-warn'>
                      {" ("}{state.transactionCreation.recievable.debit.Parent_Account.Account.title} 
                      {" "}A/c Credits on Increase{" "}
                      <StopOutlined style={{position:'relative', bottom:2}} /> {")"}
                    </span>
                    }
                    {state.transactionCreation.recievable.debit.Parent_Account.Account.inc=="debit" &&
                    <span className='acc-rec-succ'>
                      {" ("}{state.transactionCreation.recievable.debit.Parent_Account.Account.title} 
                      {" "}A/c Debits on Increase{" "}
                      <CheckCircleOutlined style={{position:'relative', bottom:2}} /> {")"}
                    </span>
                    }
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-1'>
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

              {state.transactionCreation.salesTax.exists &&
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                  </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-1'>
                    {state.transactionCreation.salesTax.debit.title}
                    {state.transactionCreation.salesTax.debit.Parent_Account.Account.inc=="credit" &&
                    <span className='acc-rec-warn'>
                      {" ("}{state.transactionCreation.salesTax.debit.Parent_Account.Account.title} 
                      {" "}A/c Credits on Increase{" "}
                      <StopOutlined style={{position:'relative', bottom:2}} /> {")"}
                    </span>
                    }
                    {state.transactionCreation.salesTax.debit.Parent_Account.Account.inc=="debit" &&
                    <span className='acc-rec-succ'>
                      {" ("}{state.transactionCreation.salesTax.debit.Parent_Account.Account.title} 
                      {" "}A/c Debits on Increase{" "}
                      <CheckCircleOutlined style={{position:'relative', bottom:2}} /> {")"}
                    </span>
                    }
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-1'>
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

              {state.transactionCreation.bankCharges.exists &&
              <>
                <Col md={2} className="gl-col-lines">
                  <span>{moment(state.date).format("DD-MMM-YYYY")}</span>
                  </Col>
                <Col md={6} className="gl-col-lines py-2">
                  <h6 className='mx-1'>
                    {state.transactionCreation.bankCharges.debit.title}
                    {state.transactionCreation.bankCharges.debit.Parent_Account.Account.inc=="debit" &&
                    <span className='acc-rec-succ'>
                      {" ("}{state.transactionCreation.bankCharges.debit.Parent_Account.Account.title} 
                      {" "}A/c Debits on Increase{" "}
                      <CheckCircleOutlined style={{position:'relative', bottom:2}} /> {")"}
                    </span>
                    }
                  </h6>
                  <hr/>
                  <h6 className='text-end mx-1'>
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
*/