const SET_MOBILE_MENU_OPENED = 'SET_MOBILE_MENU_OPENED';
const SET_MOBILE_MENU_CLOSED = 'SET_MOBILE_MENU_CLOSED';
const SET_GENERAL_INFO = 'SET_GENERAL_INFO';
const SET_HS_INFO = 'SET_HS_INFO';
const SET_DAYS_INFO = 'SET_DAYS_INFO';

export const setMobileMenuOpened = () => ({
  type: SET_MOBILE_MENU_OPENED
});

export const setMobileMenuClosed = () => ({
  type: SET_MOBILE_MENU_CLOSED
});

export const setGeneralInfo = generalInfo => ({
  type: SET_GENERAL_INFO,
  generalInfo
});

export const setHsInfo = hsInfo => ({
  type: SET_HS_INFO,
  hsInfo
});

export const setDaysInfo = daysInfo => ({
  type: SET_DAYS_INFO,
  daysInfo
})

const initialState = {
  mobileMenuOpened: false,
  generalInfo: {
    hotspots: { total: 0, online: 0, dataonly: 0 },
    validators: 0,
    blockHeight: 0,
    geolocation: { countries: 0, cities: 0 }
  },
  hsInfo: {},
  daysInfo: {}
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

  case SET_DAYS_INFO:
    return { ...state, daysInfo: action.daysInfo };

  default:
    return state;
  }
}
