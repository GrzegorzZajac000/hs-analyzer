const SET_MOBILE_MENU_OPENED = 'SET_MOBILE_MENU_OPENED';
const SET_MOBILE_MENU_CLOSED = 'SET_MOBILE_MENU_CLOSED';
const SET_GENERAL_INFO = 'SET_GENERAL_INFO';

export const setMobileMenuOpened = () => ({
  type: SET_MOBILE_MENU_OPENED
});

export const setMobileMenuClosed = () => ({
  type: SET_MOBILE_MENU_CLOSED
});

export const setGeneralInfo = generalInfo => ({
  type: SET_GENERAL_INFO,
  generalInfo
})

const initialState = {
  mobileMenuOpened: false,
  generalInfo: {}
};

export default function counter (state = initialState, action) {
  switch (action.type) {
  case SET_MOBILE_MENU_OPENED:
    return { ...state, mobileMenuOpened: true };

  case SET_MOBILE_MENU_CLOSED:
    return { ...state, mobileMenuOpened: false };

  case SET_GENERAL_INFO:
    return { ...state, generalInfo: action.generalInfo }

  default:
    return state;
  }
}
