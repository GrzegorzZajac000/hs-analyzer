const SET_MOBILE_MENU_OPENED = 'SET_MOBILE_MENU_OPENED';
const SET_MOBILE_MENU_CLOSED = 'SET_MOBILE_MENU_CLOSED';
const SET_GENERAL_INFO = 'SET_GENERAL_INFO';
const SET_HS_INFO = 'SET_HS_INFO';
const ADD_HS_TO_LIST = 'ADD_HS_TO_LIST';
const REMOVE_HS_FROM_LIST = 'REMOVE_HS_FROM_LIST';
const USE_HS = 'USE_HS';
const SHOW_HS_MODAL = 'SHOW_HS_MODAL';
const HIDE_HS_MODAL = 'HIDE_HS_MODAL';

export const setMobileMenuOpened = () => ({ type: SET_MOBILE_MENU_OPENED });
export const setMobileMenuClosed = () => ({ type: SET_MOBILE_MENU_CLOSED });
export const setGeneralInfo = generalInfo => ({ type: SET_GENERAL_INFO, generalInfo });
export const setHsInfo = hsInfo => ({ type: SET_HS_INFO, hsInfo });
export const addHSToList = hsObject => ({ type: ADD_HS_TO_LIST, hsObject });
export const removeHSFromList = hsIndex => ({ type: REMOVE_HS_FROM_LIST, hsIndex });
export const useHS = hsIndex => ({ type: USE_HS, hsIndex });
export const showHSModal = () => ({ type: SHOW_HS_MODAL });
export const hideHSModal = () => ({ type: HIDE_HS_MODAL });

const initialState = {
  mobileMenuOpened: false,
  generalInfo: {
    hotspots: { total: 0, online: 0, dataonly: 0 },
    validators: 0,
    blockHeight: 0,
    geolocation: { countries: 0, cities: 0 }
  },
  hsInfo: {},
  hsList: [],
  currentHS: null,
  hsModal: false
};

export default function counter (state = initialState, action) {
  switch (action.type) {
  case SET_MOBILE_MENU_OPENED:
    return { ...state, mobileMenuOpened: true };

  case SET_MOBILE_MENU_CLOSED:
    return { ...state, mobileMenuOpened: false };

  case SET_GENERAL_INFO:
    return { ...state, generalInfo: action.generalInfo };

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

  case USE_HS:
    return { ...state, currentHS: action.hsIndex };

  case SHOW_HS_MODAL:
    return { ...state, hsModal: true };

  case HIDE_HS_MODAL:
    return { ...state, hsModal: false };

  default:
    return state;
  }
}
