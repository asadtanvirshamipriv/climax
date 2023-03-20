import axios from "axios";
import moment from "moment";

function recordsReducer(state, action){
    switch (action.type) {
      case 'set': {
        return { ...state, [action.var]: action.pay } 
      }
      case 'on': {
        return {
            ...state,
            visible: true,
        }
      }
      case 'off': {
        let returnVal = {
          ...state, visible: false
        };
        return returnVal
      }
      default: return state 
    }
};

const initialState = {

  records: [],
  load:false,
  visible:false,
  glVisible:false,

  invoices: [],
  load: false,
  autoOn:false,
  auto:'0',
  exRate:'1',
  manualExRate:'1',

  transaction :"Cash",
  subType:'Cheque',
  onAccount:'Client',
  variable:"",
  drawnAt:'',
  accounts:[
      {Parent_Account:{CompanyId:1, title:''}}
  ],
  checkNo:'',
  search:'',
  date:moment(),
  bankCharges:0.0,
  
  gainLoss :"Gain",
  gainLossAmount:0.0,
  taxAmount:0.0,
  isPerc:false,
  accountsLoader:false,
  taxPerc:0.0,
  finalTax:0.0,
  indexes:[],
  partyAccountRecord:{},
  payAccountRecord:{},
  taxAccountRecord:{},
  bankChargesAccountRecord:{},
  gainLossAccountRecord:{},

  totalrecieving:0.00,

  transactionCreation:[],
  activityCreation:[],
  transLoad:false
};

const getCompanyName = (id) => {
    let result = "";
    result = id==1?'SNS':id==2?"CLS":"ACS"
   return result;
}

const getAccounts = async(trans, companyId) => {
    const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{
        headers:{type:trans, companyid:companyId}
    }).then((x)=> x.data.result )
    return result;
}

const totalRecieveCalc = (vals) => {

    let total = 0.00;
    vals.forEach((x)=>{
      if(x.receiving>0){
        total = total+ parseFloat(x.receiving)
      }
    });

    return total;
}

const getInvoices = (vals) => {

    let total = 0.00;
    vals.forEach((x)=>{
      if(x.receiving>0){
        total = total+ parseFloat(x.receiving)
      }
    });

    return total;
}

export { recordsReducer, initialState, getCompanyName, getAccounts, totalRecieveCalc };