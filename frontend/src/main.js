const     _ = require('lodash');
const     $ = require('jquery');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.js';


import 'reset-css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

$(document).ready(doStuff);


function doStuff() {

    ReactDOM.render(<App/>, $('#app')[0]);

}
