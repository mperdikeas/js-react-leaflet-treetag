const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console
require('jquery-ui-bundle'); // https://stackoverflow.com/a/39230057/274677
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.jsx';


import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import GeometryContextProvider  from './context/geometry-context.jsx'
import LoginContextProvider     from './context/login-context.jsx'

import { Provider }             from "react-redux";
import store                    from './store/index.js';

import 'leaflet-draw';


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




