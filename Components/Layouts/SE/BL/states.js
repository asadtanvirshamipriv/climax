import { delay } from "/functions/delay";
import axios from "axios";

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
      case 'setContainerFinal': {
        return {
            ...state,
        }
      }
      case 'modalOff': {
        let returnVal = {
          ...state,
          visible: false,
          edit: false
        };
        return returnVal
      }
      default: return state 
    }
};

const baseValues = {
  //Basic Info
  id:'',
  hbl:'',
  hblDate:'',
  hblIssue:'',
  mbl:'',
  mblDate:'',
  status:'',
  blReleaseStatus:'',
  blHandoverType:'',
  releaseInstruction:'',
  remarks:'',
  sailingDate:'',
  AgentStamp:'',
  onBoardDate:'',
  issuePlace:'',
  issueDate:'',
  formE:'',
  SEJobId:'',
  notifyPartyOneId:'',
  notifyPartyTwoId:'',
  //Values Drawn From Job
  jobNo:'',
  shipper:'',
  consignee:'',
  overseas_agent:'',
  commodity:'',
  shipDate:'',
  vessel:'',
  pol:'',
  pod:'',
  poDelivery:'',
  unit:'',
  fs:'',
  fd:'',
  hs:'',
  agentM3:'',
  coloadM3:'',
  equip:[]
};

const initialState = {
  records: [],
  load:false,
  visible:false,
  partyVisible:false,
  jobsData:[],
  partiesData:[],
  containersInfo:[],
  deletingContinersList:[],
  freightType:"",
  shipperContent:"",
  consigneeContent:"",
  notifyOneContent:"",
  notifyTwoContent:"",
  deliveryContent:"",
  marksContent:"",
  noOfPckgs:"",
  saveContainers:false,
  descOfGoodsContent:"",
  grossWeightContent:"",
  measurementContent:"",
  jobLoad:false,
  edit:false,
  gross:0, net:0, tare:0, wtUnit:0, cbm:0, pkgs:0, unit:0,
  values:baseValues,
  jobId:'',
  selectedRecord:{}
};

const fetchJobsData = async(set) => {
  set('jobLoad', true);
  set('partyVisible', true);
  await delay(300);
  const jobsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEA_JOBS_WITHOUT_BL)
  .then((x)=>{
    let data = [];
    if(x.data.status=="success"){
      x.data.result.forEach(x => {
        data.push({...x, check:false})
      });
    }
    return data
  });
  set('jobsData', jobsData);
  set('jobLoad', false);
}

const ParseAsHtml = (values) => {
  let result = "";
  values.forEach((x, i)=>{
    if(x!=""){
      result = result + `<p> ${x} </p>`
    }
  })
  return result
}

const setJob = (set, x, state, reset) => {
  if(!x.check){
    let temp = [...state.jobsData];
    temp.forEach((y, i2) => {
      if(y.jobNo==x.jobNo) {
        temp[i2].check=true
      } else {
        temp[i2].check=false 
      }
    })
    set('jobData', temp);
  } else {
    console.log(x)
    let temp = state.values;
    temp.SEJobId = x.id;
    temp.jobNo = x.jobNo;
    temp.consignee = x.consignee.name;
    temp.shipper = x.shipper.name;
    temp.overseas_agent=x.overseas_agent.name;
    temp.fd = x.fd;
    temp.pod = x.pod;
    temp.pol = x.pol;
    temp.vessel = x.vessel;
    temp.shipDate = x.shipDate;
    temp.commodity = x.commodity.name;
    temp.equip = x.SE_Equipments;
    console.log(temp)
    
    // set('shipperContent',ParseAsHtml(x.Client.address1.split("  ")));
    // set('consigneeContent',ParseAsHtml(x.consignee.address1.split("  ")));
    // set('deliveryContent',ParseAsHtml(x.overseas_agent.address1.split("  ")));
    
    set('freightType',x.freightType);
    set('deliveryContent',x.overseas_agent.address1);
    set('consigneeContent',x.consignee.address1);
    set('shipperContent',x.Client.address1);

    set('values', temp);
    //reset(state.values)
    set('partyVisible', false);
  }
}

const calculateContainerInfos = (state, set) => {
  let tempContainers = state.containersInfo;
  let cbm = 0.0
  let tare = 0.0
  let net = 0.0
  let gross = 0.0
  let pkgs = 0
  let unit = ""
  let wtUnit = ""
  tempContainers.forEach((x,i)=>{
    console.log(x)
    if(i==0){
      unit= x.unit
      wtUnit= x.wtUnit
    }
    cbm = cbm + x.cbm
    tare = tare + x.tare
    net = net + x.net
    gross = gross + x.gross
    pkgs = pkgs + x.pkgs
  })
  console.log(gross, net, tare, wtUnit, cbm, pkgs, unit)
  set('gross',gross);
  set('net',net);
  set('tare',tare);
  set('wtUnit',wtUnit);
  set('cbm',cbm);
  set('pkgs',pkgs);
  set('unit',unit);
  set('saveContainers',false);
}

export {calculateContainerInfos, recordsReducer, initialState, baseValues, fetchJobsData, setJob };