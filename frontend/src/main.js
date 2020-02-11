const     _ = require('lodash');
const     $ = require('jquery');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.js';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css'; // https://medium.com/commencis/how-to-import-bootstrap-using-webpack-7245eba98056

$(document).ready(doStuff);


function doStuff() {

    ReactDOM.render(<App/>, $('#app')[0]);

}
