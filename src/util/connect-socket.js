import openSocket from "socket.io-client";
import store from './store';
import { displayLog } from "./common";
var socket
if (process.env.NODE_ENV === 'production') {
 // socket = openSocket("http://18.134.216.87:5000/");
  socket = openSocket("https://api.livoh.com:8443/");
}
else {
 // socket = openSocket("http://18.134.216.87:5000/");
  socket = openSocket("https://api.livoh.com:8443/");
}

export const Emit = (MethodName, body, header) => {
  console.log("body(reqData) is", body)
  store.dispatch({
    type: 'START_LOADER'
  })
  let headers;
  if (header) {
    headers = header
  } else {
    headers = {
      "language": 'en',
      "auth_token": localStorage.getItem('DUDU_AUTH_TOKEN'),
      "web_app_version": "1.0.0"
    }
  }
  let data = {
    body: body,
    headers: headers
  }
  socket.emit(MethodName, data);
}
export const GetResponse = (cb) => {
  console.log('in getRes');

  socket.once('response', message => {
    store.dispatch({
      type: 'STOP_LOADER'
    })
    if (message.code === 0) {
      displayLog(0, message.message)
    }
    else if (message.code === 1 && message.message && message.message.length > 0) {
      displayLog(1, message.message)
    }
    else if (message.code === 401) {
      localStorage.clear();
      displayLog(0, "Session is Expired")
    }
    // else {
    //   displayLog(0, "Network error")
    //   localStorage.removeItem('DUDU_AUTH_TOKEN');
    //   localStorage.removeItem('USER');

    // }
    cb(message);
  });
}

export const Disconnect = () => {
  socket.disconnect()
}