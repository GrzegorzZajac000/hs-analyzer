const SET_HS_INFO = 'SET_HS_INFO';
const ADD_HS_TO_LIST = 'ADD_HS_TO_LIST';
const REMOVE_HS_FROM_LIST = 'REMOVE_HS_FROM_LIST';
const UPDATE_HS = 'UPDATE_HS';
const USE_HS = 'USE_HS';
const SHOW_HS_MODAL = 'SHOW_HS_MODAL';
const HIDE_HS_MODAL = 'HIDE_HS_MODAL';
const SET_DATE_MODE = 'SET_DATE_MODE';
const SET_MIN_TIME = 'SET_MIN_TIME';
const SET_MAX_TIME = 'SET_MAX_TIME';

export const setHsInfo = hsInfo => ({ type: SET_HS_INFO, hsInfo });
export const addHSToList = hsObject => ({ type: ADD_HS_TO_LIST, hsObject });
export const removeHSFromList = hsIndex => ({ type: REMOVE_HS_FROM_LIST, hsIndex });
export const updateHS = (hsObject, hsIndex) => ({ type: UPDATE_HS, hsObject, hsIndex });
export const useHS = hsIndex => ({ type: USE_HS, hsIndex });
export const showHSModal = () => ({ type: SHOW_HS_MODAL });
export const hideHSModal = () => ({ type: HIDE_HS_MODAL });
export const setDateMode = dateMode => ({ type: SET_DATE_MODE, dateMode });
export const setMinTime = minTime => ({ type: SET_MIN_TIME, minTime });
export const setMaxTime = maxTime => ({ type: SET_MAX_TIME, maxTime });

const initialState = {
  hsInfo: [],
  hsList: [],
  currentHS: null,
  hsModal: false,
  dateMode: '7',
  minTime: null,
  maxTime: null
};

export default function counter (state = initialState, action) {
  switch (action.type) {
  case SET_HS_INFO:
    return { ...state, hsInfo: action.hsInfo };

  case ADD_HS_TO_LIST: {
    const hsList = state.hsList;
    hsList.push(action.hsObject);

    return { ...state, hsList };
  }

  case REMOVE_HS_FROM_LIST: {
    const hsList = state.hsList;
    hsList.splice(action.hsIndex, 1);

    return { ...state, hsList };
  }

  case UPDATE_HS: {
    const hsList = state.hsList;
    hsList[action.hsIndex] = action.hsObject;

    return { ...state, hsList };
  }

  case USE_HS:
    return { ...state, currentHS: action.hsIndex };

  case SHOW_HS_MODAL:
    return { ...state, hsModal: true };

  case HIDE_HS_MODAL:
    return { ...state, hsModal: false };

  case SET_DATE_MODE:
    return { ...state, dateMode: action.dateMode };

  case SET_MIN_TIME:
    return { ...state, minTime: action.minTime };

  case SET_MAX_TIME:
    return { ...state, maxTime: action.maxTime };

  default:
    return state;
  }
}
