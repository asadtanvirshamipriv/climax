import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Modal } from 'antd';
import { getCompanyName } from './states';
import Spinner from 'react-bootstrap/Spinner';

const AccountSelection = ({state, dispatch}) => {

  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }

    console.log(state.accounts)

  return (
    <>
    <Modal title={`Select Account`} open={state.visible} 
        onOk={()=>dispatch({type:'on'})} 
        onCancel={()=>dispatch({type:'off'})}
        footer={false} maskClosable={false}
        width={'60%'}
    >
    <>
        {!state.accountsLoader &&
        <div style={{minHeight:300}}>
            <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
            <Table className='tableFixHead' bordered>
                <thead>
                    <tr>
                        <th>Sr.</th>
                        <th>Title</th>
                        <th>Parent</th>
                        <th>Account</th>
                    </tr>
                </thead>
                <tbody>
                {state.accounts.map((x, index) => {
                return (
                    <tr key={index} className="tr-clickable"
                        onClick={() => {
                            set(state.variable, x);
                            set('visible', false);
                        }}
                    >
                        <td>{index + 1}</td>
                        <td>{x.title} ~ {getCompanyName(x.Parent_Account.CompanyId)}</td>
                        <td>{x.Parent_Account.title}</td>
                        {/* <td>{x.Parent_Account.Account.title}</td> */}
                    </tr>
                    )
                })}
                </tbody>
            </Table>
            </div>
        </div>
        }
        {state.accountsLoader && <div className='text-center'><Spinner/></div>}
    </>
    </Modal>
    </>
  )
}

export default AccountSelection