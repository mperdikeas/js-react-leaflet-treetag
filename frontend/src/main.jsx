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


$(document).ready(doStuff);

function doStuff() {
  doRender();
}

function doRender() {
  ReactDOM.render(
    <LoginContextProvider>
      <GeometryContextProvider>
        <App/>
      </GeometryContextProvider>
    </LoginContextProvider>
    , $('#app')[0]);
}




