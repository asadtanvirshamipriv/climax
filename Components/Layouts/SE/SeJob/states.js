import * as yup from "yup";
import axios from "axios";

const SignupSchema = yup.object().shape({

});

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
          ...state, popShow:false, visible: false,
          edit: false, viewHistory:false
        };
        state.edit?returnVal.selectedRecord={}:null
        !state.edit?returnVal.equipments=[{id:'', size:'', qty:'', dg:'', gross:'', teu:''}]:null
        return returnVal
      }
      default: return state 
    }
};

const baseValues = {
  //Basic Info
  id:'',
  jobNo:'',
  costCenter:'',
  shipStatus:'',
  jobDate:'',
  jobType:'',
  jobKind:'',
  subType:'',
  dg:'',
  shipDate:'',
  freightType:'',
  nomination:'',
  ClientId:'',
  shipperId:'',
  consigneeId:'',
  commodityId:'',
  overseasAgentId:'',
  salesRepresentatorId:'',
  pol:'',
  pod:'',
  fd:'',
  customCheck:[],
  customAgentId:'',
  transportCheck:[],
  transporterId:'',
  forwarderId:'',
  carrier:'',
  localVendorId:'',
  shippingLineId:'',
  vessel:'',
  cutOffDate:'',
  cutOffTime:'',
  eta:'',
  
  aesDate:'',
  aesTime:'',
  siCutOffDate:'',
  siCutOffTime:'',
  eRcDate:'',
  eRcTime:'',
  eRlDate:'',
  eRlTime:'',
  doorMove:'',
  vgmCutOffDate:'',
  vgmCutOffTime:'',

  weight:'',
  bkg:'',
  container:'',
  shpVol:'',
  teu:'',
  pcs:'',
  vol:'',

  delivery:'',
  terminal:'',
  freightPaybleAt:'',
  polDate:'',
  podDate:'',
  companyId:'',
  exRate:'1',
  approved:["1"]
};

const initialState = {
  records: [],
  load:false,
  chargeLoad:false,
  visible:false,
  headVisible:false,
  edit:false,
  popShow:false,
  viewHistory:false,

  paybleCharges:[],
  reciveableCharges:[],

  payble:{ pp:0.0, cc:0.0, total:0.0, tax:0.0 },
  reciveable:{ pp:0.0, cc:0.0, total:0.0, tax:0.0 },
  netAmount:0.0,

  vendorParties:[],
  clientParties:[],

  headIndex:"",

  values:baseValues,

  title:"",
  note:"",
  notes:[],
  deleteList:[],

  chargesTab:'1',
  selectedInvoice:'',
  invoiceData:{},
  exRate:"1",
  
  consigneeList:[],
  shipperList:[],
  forwarderList:[],
  salesRepList:[],
  carrierList:[
    {
      id:'Emirates',
      name:'Emirates'
    },
    {
      id:'Elton',
      name:'Elton'
    },
  ],
  equipments:[
    {id:'', size:'', qty:'', dg:'', gross:'', teu:''}
  ],
  tabState:"1",
  vendorList:[],
  overseasAgentList:[],
  history:[],
  fields:{
    chargeList:[],
    party:{
      shipper:[],
      consignee:[],
      notify:[],
      client:[]
    },
    vendor:{
      transporter:[],
      forwarder:[],
      overseasAgent:[],
      chaChb:[],
      localVendor:[]
    },
    commodity:[],
    vessel:[],
    sr:[]
  },
  // Editing Records
  selectedRecord:{},
  oldRecord:{},
};

const getClients = (id) => {
  const result = axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_CLIENTS_FOR_CHARGES, {
    headers:{id:id}
  })
  .then((x)=>x.data.result)
  return result;
}

const getVendors = (id) => {
  const result = axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VENDORS_FOR_CHARGES, {
    headers:{id:id}
  })
  .then((x) => x.data.result)
  return result;
}

const getHeads = async(id) => {
  let paybleCharges = [];
  let reciveableCharges = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_HEADS,{
      headers:{"id": `${id}`}
  }).then((x)=>{
      if(x.data.status=="success"){
          let tempCharge = [];
          x.data.result.forEach((x)=>{
              if(x.payType!='Payble'){
                  x.Charge_Heads.forEach((y)=>{
                      tempCharge.push({...y, sep:false});
                  })
              }
          });

          reciveableCharges = tempCharge;
          tempCharge = [];
          x.data.result.forEach((x)=>{
              if(x.payType=='Payble'){
                  x.Charge_Heads.forEach((y)=>{
                      tempCharge.push({...y, sep:false});
                  })
              }
          })
          paybleCharges = tempCharge;

        }
    })
    return { reciveableCharges, paybleCharges }
}

export { recordsReducer, initialState, baseValues, SignupSchema, getClients, getVendors, getHeads };