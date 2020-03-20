const     $ = require('jquery');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.jsx';


import 'reset-css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import GeometryContextProvider  from './context/geometry-context.jsx'
import LoginContextProvider     from './context/login-context.jsx'

import { Provider }             from "react-redux";
import store                    from './store/index.js';

$(document).ready(doStuff);

function doStuff() {
  doRender();
}

function doRender() {
  ReactDOM.render(
    <Provider store={store}>
      <LoginContextProvider>
        <GeometryContextProvider>
          <App/>
        </GeometryContextProvider>
      </LoginContextProvider>
    </Provider>
    , $('#app')[0]);
}




