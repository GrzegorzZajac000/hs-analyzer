const SET_MOBILE_MENU_OPENED = 'SET_MOBILE_MENU_OPENED';
const SET_MOBILE_MENU_CLOSED = 'SET_MOBILE_MENU_CLOSED';

export const setMobileMenuOpened = () => ({
  type: SET_MOBILE_MENU_OPENED
});

export const setMobileMenuClosed = () => ({
  type: SET_MOBILE_MENU_CLOSED
});

const initialState = {
  mobileMenuOpened: false,
  faqComponentIndex: -1,
  themeMode: undefined
};

export default function counter (state = initialState, action) {
  switch (action.type) {
  case SET_MOBILE_MENU_OPENED:
    return { ...state, mobileMenuOpened: true };

  case SET_MOBILE_MENU_CLOSED:
    return { ...state, mobileMenuOpened: false };

  default:
    return state;
  }
}
