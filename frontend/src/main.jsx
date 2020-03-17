const     $ = require('jquery');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.jsx';


import 'reset-css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import {assert} from 'chai';
import axios from 'axios';

$(document).ready(doStuff);


import GeometryContextProvider  from './context/geometry-context.jsx'

function doStuff() {
  if (true)
    submitCredentials('admin', 'pass');

  ReactDOM.render(
    <GeometryContextProvider>
      <App/>
    </GeometryContextProvider>
    , $('#app')[0]);
}

function submitCredentials(username, password) {
  console.log('submitCredentials');
  const url = 'https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/login';
  axios.post(url, {
    username: username,
    password: password
  }).then(res => {
    if (res.data.err != null) {
      console.log('login API call error');
      assert.fail(res.data.err);
    } else {
      console.log('login API call success');
      if (res.data.t.loginFailureReason===null) {
        setCookie('access_token', res.data.t.accessToken, 0);
        console.log('login was successful and cookie was set');
      } else {
        console.log('login was unsuccessful');
        assert.fail(res.data.t.loginFailureReason);
      }
    }
  }).catch( err => {
    console.log(err);
    console.log(JSON.stringify(err));
    console.log('6');
    assert.fail(err);
  });
}


function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  console.log(`Cookie set as ${document.cookie}`);
}


