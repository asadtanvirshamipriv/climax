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
  blhandoverType:'',
  hbl:'',
  sailingDate:'',
  shipperDetail:'',
  consigneeDetail:'',
  notifyOneDetail:'',
  notifyTwoDetail:'',
  deliveryAgentDetail:'',
  AgentStamp:'',
  hs:'',
  marksContainerDetail:'',
  noOfPackDetail:'',
  descOfGoodsDetail:'',
  grossWeightDetail:'',
  measureDetail:'',
  onBoardDate:'',
  issuePlace:'',
  issueDate:'',
  formE:'',
  SEJobId:'',
  notifyPartyOneId:'',
  notifyPartyTwoId:'',
};

const initialState = {
  records: [],
  load:false,
  visible:false,
  partyVisible:false,
  jobsData:[],
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
    x.data.result.forEach(x => {
      data.push({...x, check:false})
    });
    return data
  });
  set('jobsData', jobsData);
  set('jobLoad', false);
}

export { recordsReducer, initialState, baseValues, fetchJobsData };