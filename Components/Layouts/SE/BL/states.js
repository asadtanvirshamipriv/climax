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
  pofd:'',
  pot:'',
  fd:'',
  //Second Ports Option
  polTwo:'',
  podTwo:'',
  poDeliveryTwo:'',
  AgentStamp:'',

  freightType:"",
  unit:'',
  hs:'',
  agentM3:'',
  coloadM3:'',
  equip:[],
  gross:0,
  net:0,
  tare:0,  
  wtUnit:0,
  pkgs:0,  
  unit:0,  
  cbm:0   
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
  //setNotifyParties:false,
  updateContent:false,
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

const convetAsHtml = (values) => {
  const getVar = (val) => {
    let result = ""
    if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone2"){ result='TEL'; }
    return result;
  }
  let result = "";
  let gottenValues = {...values};
  delete gottenValues.id;
  Object.keys(gottenValues).forEach((x)=>{
    result = result + `<p> ${getVar(x)} ${gottenValues[x]}</P> `;

  })
  return result
}

const setJob = (set, x, state, reset, allValues) => {
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
    allValues.SEJobId =      x.id;                 
    allValues.jobNo =        x.jobNo;                        
    allValues.consignee =    x.consignee.name;     
    allValues.shipper =      x.shipper.name;            
    allValues.overseas_agent=x.overseas_agent.name;
    allValues.pol =          x.pol;                
    allValues.pofd =          x.pod;                
    allValues.fd =           x.fd;                 
    allValues.vessel =       x.vessel;             
    allValues.shipDate =     x.shipDate;             
    allValues.commodity =    x.commodity.name;     
    allValues.equip =        x.SE_Equipments;      
    allValues.freightType =  x.freightType;      
    allValues.delivery =  x.delivery;      
  
    set('deliveryContent',convetAsHtml(x.overseas_agent));
    set('consigneeContent',convetAsHtml(x.consignee));
    set('shipperContent',convetAsHtml(x.Client));
    //set('values', allValues);
    reset(allValues)
    set('partyVisible', false);
    set('updateContent', !state.updateContent);
  }
}

const calculateContainerInfos=(state, set, reset, allValues)=>{
  let tempContainers = state.containersInfo;
  let cbm = 0.0
  let tare = 0.0
  let net = 0.0
  let gross = 0.0
  let pkgs = 0
  let unit = ""
  let wtUnit = ""
  tempContainers.forEach((x,i)=>{
    if(i==0){
      unit= x.unit;
      wtUnit= x.wtUnit;
    }
    cbm = cbm + x.cbm;
    tare = tare + x.tare;
    net = net + x.net;
    gross = gross + x.gross;
    pkgs = pkgs + x.pkgs;
  })
  set('saveContainers',false);

  console.log(allValues);
  allValues.gross =  gross;
  allValues.net =    net;
  allValues.tare =   tare;
  allValues.wtUnit = wtUnit;
  allValues.pkgs =   pkgs;
  allValues.unit =   unit;
  allValues.cbm =    cbm;
  reset(allValues);

}

export { convetAsHtml, calculateContainerInfos, recordsReducer, initialState, baseValues, fetchJobsData, setJob };