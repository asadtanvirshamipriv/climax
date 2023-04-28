import React, { useRef, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import parse from 'html-react-parser';

const Stamps = ({state, control, useWatch}) => {
    let inputRef = useRef(null);
    const allValues = useWatch({control})
    useEffect(() => {
      console.log(state);
      console.log(allValues);
    }, [])
    const border = "1px solid silver"
  return (
    <div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
    <div style={{width:"10%"}}>
    <ReactToPrint content={()=>inputRef} trigger={()=><div className='div-btn-custom text-center p-2'>Print</div>} />
    </div>
    <div 
        style={{display:"none"}}
    >
    <div ref={(response) => (inputRef = response)}>
        <Row className='px-5' style={{fontFamily:"serif", paddingTop:33}}>
            <Col md={12}>
                <div className='text-center fw-6 grey-txt fs-16' style={{ lineHeight:1.45}}>BILL OF LADING FOR COMBINED TRANSPORT SHIPMENT OR PORT TO PORT</div>
            </Col>
            <Col md={12} style={{borderTop:border}} className='fs-11'>
                <Row>
                    <Col md={6} className='px-0 '>
                    <div style={{borderBottom:border, height:107}} className=''>
                    <div className='fw-5 grey-txt' style={{lineHeight:1.3}}>Shipper</div>
                    <div className='bl-print'>{parse(state.shipperContent)}</div>
                    </div>
                    <div style={{borderBottom:border, height:103}} className=''>
                    <div className='fw-5 grey-txt' style={{lineHeight:1.4}}>Consignee Or Order</div>
                    <div className='bl-print'>{parse(state.consigneeContent)}</div>
                    </div>                  
                    <div className='pb-2' style={{height:96}}>
                    <div className='fw-5 grey-txt' style={{lineHeight:1.4}}>Notify Party / Address</div>
                    <div className='bl-print'>{parse(state.notifyOneContent)}</div>
                    </div>                  
                    </Col>
                    <Col md={6} style={{borderLeft:border}} className='px-0'>
                    <div style={{borderBottom:border}} className='pb-3 px-2'>
                        <span><span style={{color:'grey'}}>Ref. # </span><span className='fw-7'>{allValues.jobNo}</span></span>
                        <span className='mx-5 px-4'><span style={{color:'grey'}}>Ref. # </span><span className='fw-7'>{allValues.hbl}</span></span>
                    </div> 
                    <div style={{borderBottom:border}} className='pb-3 px-2'>
                        <span><span style={{color:'grey'}}>F/Agent Name & Ref. # </span><span className='fw-7'></span></span>
                    </div> 
                    <div className='pb-2 text-center' style={{paddingTop:"3%"}}>
                        <div className='grey-txt'>
                        <img src={'seanet-logo.png'} height={120} className='invert ' />
                        <div style={{fontFamily:"sans-serif"}} className='fs-15'>SHIPPING & LOGISTICS</div>
                        <div className='mt-2' style={{lineHeight:1.5}}>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
                        <div style={{lineHeight:1.5}}>Tel: {"("}92-21{")"} 34547575, 34395444, 34395444, 34395444</div>
                        <div style={{lineHeight:1.5}}>Email info@seanetpk.com, URL www.seanetpk.com </div>
                        </div>
                    </div> 
                    </Col>
                </Row>
                <Row style={{borderTop:border}}>
                    <Col style={{borderRight:border}} className='px-0'>
                        <div style={{height:37}}>
                        <div className='grey-txt'>Initial Carriage {"("}Mode{")"}</div>
                        </div>
                    </Col>
                    <Col style={{borderRight:border}} className='px-0'>
                        <div style={{height:37}} className='px-1'>
                        <div className='grey-txt'>Initial Place Of Reciept</div>
                        </div>
                    </Col>
                    <Col className='px-0'>
                        <div style={{height:37}} className='px-1'>
                            <div className='grey-txt'>Port Of Discharge</div>
                        </div>
                    </Col>
                </Row>
                <Row style={{borderTop:border}}>
                    <Col style={{borderRight:border}} className='px-0'>
                        <div style={{height:42}}>
                        <div className='grey-txt'>Vessel and Voyage</div>
                        </div>
                    </Col>
                    <Col style={{borderRight:border}} className='px-0'>
                        <div style={{height:42}} className='px-1'>
                        <div className='grey-txt'>Port Of Loading</div>
                        </div>
                    </Col>
                    <Col className='px-0'>
                        <div style={{height:42}} className='px-1'>
                            <div className='grey-txt'>Place Of Delivery</div>
                        </div>
                    </Col>
                </Row>
                <Row style={{borderTop:border, height:10}}>
                    <Col style={{borderRight:border, maxHeight:5, minWidth:170, maxWidth:170}} className='px-0'>
                        <div style={{height:42}}>
                        <div className='grey-txt text-center'>Marks and Nos; Container Nos;</div>
                        </div>
                    </Col>
                    <Col style={{borderRight:border, maxHeight:5, minWidth:340, maxWidth:340}} className='px-0' >
                        <div style={{height:42}} className='px-1'>
                        <div className='grey-txt text-center'>Number And Kind Of Packages; Description of Goods</div>
                        </div>
                    </Col>
                    <Col className='px-0' style={{borderRight:border, maxHeight:5, minWidth:130, maxWidth:130}}>
                        <div style={{height:42}} className='px-1'>
                            <div className='grey-txt text-center'>Weight{"("}kg{")"} of Cargo</div>
                        </div>
                    </Col>
                    <Col className='px-0' style={{maxWidth:90, maxHeight:5,}}>
                        <div style={{height:42}} className='px-1'>
                            <div className='grey-txt text-center' style={{lineHeight:1}}>Measurement {"("}cbm{")"} of Cargo</div>
                        </div>
                    </Col>
                </Row>
                <Row style={{minHeight:380}}>

                </Row>
                <Row>
                    <img src={"bl-bottom.png"} />
                </Row>
            </Col>
            {/* <Col md={12} style={{borderTop:border}}></Col> */}
        </Row>
    </div>
    </div>
    </div>
  )
}

export default Stamps