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


import GeometryContextProvider  from './context/geometry-context.jsx'
import {BASE_URL}               from './constants.js';


$(document).ready(doStuff);

function doStuff() {
  doRender();
}

function doRender() {
  ReactDOM.render(
    <GeometryContextProvider>
      <App/>
    </GeometryContextProvider>
    , $('#app')[0]);
}




