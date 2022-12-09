import { REGISTER_FAIL,REGISTER_SUCCESS,SUCCESS_MESSAGE_CLEAR,ERROR_CLEAR,USER_LOGIN_FAIL,USER_LOGIN_SUCCESS } from "../types/authType";
import deCodeToken from 'jwt-decode';
const authState = {
     loading: true,
     authenticate: false,
     error: '',
     successMessage: '',
     myInfo: ''
}

const tokenDecode = (token) => { //decode authToken saved in Cookie
     const tokenDecoded = deCodeToken(token);
     const expTime = new Date(tokenDecoded.exp * 1000);
     if (new Date() > expTime) { //if token is expired
          return null;
     }
     return tokenDecoded;
}

//since everytime we reload the site, the Redux state will be gone--> update the state of user's information every time with token saved in localStorage (decoding it for the users information)
//executed along with the site
const getToken = localStorage.getItem('authToken');
if (getToken) { //if it does exists or not expired yet
     const getInfo = tokenDecode(getToken);
     if (getInfo) {
          authState.myInfo = getInfo;
          authState.authenticate = true;
          authState.loading = false;
     }
     console.log(getInfo);
}

export const authReducer = (state = authState, action) => {
     const { payload, type } = action;

     if (type === REGISTER_FAIL || type===USER_LOGIN_FAIL) { //if authAction returns type= regiter_fail
          return {
               ...state, //return all the vars in state with variables updated as below:
               error: payload.error, //get the error message from the authAction.js through dispatch
               authenticate: false,
               myInfo: '', //user's information will be empty
               loading: true
          }
     }
     if (type === REGISTER_SUCCESS || type === USER_LOGIN_SUCCESS) {
          const myInfo = tokenDecode(payload.token);
          return {
               ...state,
               myInfo: myInfo, //token decoded containing email, id,... of the user from authController->authAction
               successMessage: payload.successMessage, //get from payload in case of succes in authAction.js gotten from authController.js
               error: '',
               authenticate: true,
               loading: false
          }
     }
     if (type === SUCCESS_MESSAGE_CLEAR) {
          return {
               ...state,
               successMessage: ''
          }
     }

     if (type === ERROR_CLEAR) {
          return {
               ...state,
               error: ''
          }
     }
     return state; //return authState if no error
}