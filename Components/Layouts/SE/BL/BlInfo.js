import React, { useEffect, useState } from 'react';
import InputComp from '/Components/Shared/Form/InputComp';
import TextAreaComp from '/Components/Shared/Form/TextAreaComp';
import DateComp from '../../../Shared/Form/DateComp';
import SelectComp from '../../../Shared/Form/SelectComp';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import { Row, Col } from 'react-bootstrap';
import { Modal } from 'antd';
import PartySearch from './PartySearch';
import { fetchJobsData } from './states';
import moment from 'moment';

const BlInfo = ({control, register, state, useWatch, dispatch, reset}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b})
  const notifyPartyOneId = useWatch({control,name:'notifyPartyOneId'})
  const notifyPartyTwoId = useWatch({control,name:'notifyPartyTwoId'})
  useEffect(() => {
    console.log(notifyPartyOneId)
    console.log(notifyPartyTwoId)
  }, [notifyPartyOneId, notifyPartyTwoId])

  return (
    <div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
    <Row>
        <Col md={3}>
            <Row>
                <Col md={10}>
                <div className="" style={{lineHeight:1.35}}>Job No.</div>
                <div className='dummy-input' onClick={()=>fetchJobsData(set)}>
                    {state.values.jobNo}
                </div>
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <InputComp register={register} name='hbl' control={control} label='HBL #' width={150} />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <InputComp register={register} name='mlb' control={control} label='MBL #' width={150} />
                </Col>
            </Row>
        </Col>
        <Col md={2}>
            <Row>
                <Col md={12}>
                    <SelectComp register={register} name='status'control={control}label='Status' width={120}
                        options={[ 
                            {id:'Final', name:'Final'}, 
                            {id:'Draft', name:'Draft'} 
                        ]}
                    />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <DateComp register={register} name='hblDate'control={control}label='HBL Date' width={120} />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <DateComp register={register} name='mblDate'control={control}label='MBL Date' width={120} />
                </Col>
            </Row>
        </Col>
        <Col md={6}>
            <Row style={{border:'1px solid silver'}} className='pb-2 pt-1 mt-4'>
                <Col md={4}>
                    <SelectComp register={register} name='blReleaseStatus' control={control} label='Release Status' width={'100%'}
                        options={[ 
                            {id:'Original'        , name:'Original'        }, 
                            {id:'Surrender'       , name:'Surrender'       },
                            {id:'Hold'            , name:'Hold'            },
                            {id:'Bank Guarantee'  , name:'Bank Guarantee'  },
                            {id:'Do Null'         , name:'Do Null'         },
                            {id:'Auction'         , name:'Auction'         },
                            {id:'Telex Release'   , name:'Telex Release'   },
                            {id:'SeaWay Bill'     , name:'SeaWay Bill'     },
                            {id:'Express Release' , name:'Express Release' },
                            {id:'Without Document', name:'Without Document'}
                        ]}
                    />
                </Col>
                <Col md={4}>
                    <SelectComp register={register} name='blHandoverType' control={control} label='Handover Type' width={'100%'}
                        options={[ 
                            {id:'By Hand', name:'By Hand'}, 
                            {id:'Courier', name:'Courier'},
                            {id:'Email'  , name:'Email'  },
                            {id:'Fax'    , name:'Fax'    },
                            {id:'Telex'  , name:'Telex'  },
                        ]}
                    />
                </Col>
                <Col md={4}>
                    <div></div>
                    <SelectComp register={register} name='releaseInstruction' control={control} label='Instructions' width={'100%'}
                        options={[ 
                            {id:'Release', name:'Release'}, 
                            {id:'Stop', name:'Stop'}, 
                        ]}
                    />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <TextAreaComp register={register} rows={1} name='remarks' control={control} label='Remarks'/>
                </Col>
            </Row>
        </Col>
        <Col md={12}><hr/></Col>
        <Col md={3} className=''>
            <Row>
                <Col md={12}>
                <div className="" style={{lineHeight:1.35}}>Shipper</div>
                <div className='dummy-input'>{state.values.shipper}</div>
                </Col>
                <Col md={12}>
                <div className="mt-2" style={{lineHeight:1.35}}>Consignee</div>
                <div className='dummy-input'>{state.values.consignee}</div>
                </Col>
                <Col md={12}>
                    <SelectSearchComp register={register} name='notifyPartyOneId'control={control} label='Notify Party #1' width={'100%'}
                        options={state.partiesData}
                    />
                    <SelectSearchComp register={register} name='notifyPartyTwoId'control={control} label='Notify Party #2' width={'100%'}
                        options={state.partiesData}
                    />
                    <div className="mt-2" style={{lineHeight:1.35}}>Vessel</div>
                    <div className='dummy-input'>{state.values.vessel}</div>

                    <div className="mt-2" style={{lineHeight:1.35}}>Sailing Date</div>
                    <div className='dummy-input'>{moment(state.values.shipDate).format("DD-MM-YYYY")}</div>
                </Col>
            </Row>
        </Col>
        <Col md={7}>
            <h6 className='text-center'>Booking Info</h6> 
            <Row style={{border:'1px solid silver'}} className='pb-3 pt-2'>
                <Col md={5}>
                <Row>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>POD</div>
                        <div className='dummy-input'>{state.values.pod}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>POL</div>
                        <div className='dummy-input'>{state.values.pol}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Final Dest.</div>
                        <div className='dummy-input'>{state.values.fd}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Commodity</div>
                        <div className='dummy-input'>{state.values.commodity}</div>
                    </Col>
                </Row>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                <Row>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Overseas Agent</div>
                        <div className='dummy-input'>{state.values.overseas_agent}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>S/Line Carrier</div>
                        <div className='dummy-input'>{state.values.pol}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Total Container</div>
                        <div className='dummy-input'>
                            {state.values.equip.map((x, i)=>{
                                return(<span key={i}>{x.qty} X {x.size}</span>)
                            })
                            }
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Delivery</div>
                        <div className='dummy-input'>{state.values.commodity}</div>
                    </Col>
                </Row>
                </Col>
            </Row>
        </Col>
    </Row>
    <Modal
        open={state.partyVisible} maskClosable={false}
        onOk={()=>set('partyVisible', false)}
        onCancel={()=>set('partyVisible', false)}
        width={800} footer={false} //centered={true}
    ><PartySearch state={state} useWatch={useWatch} dispatch={dispatch} control={control} reset={reset} />    
    </Modal>
    </div>
  )
}

export default BlInfo