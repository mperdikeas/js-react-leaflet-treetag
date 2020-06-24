const     $ = require('jquery');
declare const window: any;
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console
require('jquery-ui-bundle'); // https://stackoverflow.com/a/39230057/274677
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.tsx';


import L from 'leaflet';
window.L = L; // see #1

import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'antd/dist/antd.css';

// https://stackoverflow.com/a/53580347/274677
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import { BrowserRouter } from 'react-router-dom';

import './css/style.css';


import LoginContextProvider              from './context/login-context.tsx'
import GeometryContextProvider           from './context/geometry-context.tsx'

import { Provider }             from "react-redux";
import store                    from './redux/store/index.ts';

import 'leaflet-draw';

import './hack-for-the-leaflet-wrong-image-url.ts';


$(document).ready(doStuff);

function doStuff() {
  doRender();
}

function doRender() {
  ReactDOM.render(
    <Provider store={store}>
      <LoginContextProvider>
        <GeometryContextProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </GeometryContextProvider>
      </LoginContextProvider>
    </Provider>
    , $('#app')[0]);
}





/*

   Otherwise, I was getting the following (weirdly only in Typescript):

   #1

   leaflet.draw.js:8 Uncaught ReferenceError: L is not defined
   at leaflet.draw.js:8
   at Object../node_modules/leaflet-draw/dist/leaflet.draw.js (leaflet.draw.js:10)
   at __webpack_require__ (bootstrap:19)
   at Module../src/main.tsx (main.tsx:1)
   at __webpack_require__ (bootstrap:19)
   at Object.0 (bundle.js:127403)
   at __webpack_require__ (bootstrap:19)
   at bootstrap:83
   at bootstrap:83


 */
