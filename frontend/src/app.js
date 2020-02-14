require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'reset-css';




import Map        from './map.js';
import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tileProviderId: 'esri'
        };
        this.onTileProviderSelect = this.onTileProviderSelect.bind(this);
    }

    componentDidMount() {
    }
    
    componentDidUpdate(prevProps, prevState) {
    }

    onTileProviderSelect(tileProviderId) {
        this.setState({tileProviderId :tileProviderId});
    }


    render() {
        const options = [];
        for (let x in BaseLayers) {
            console.log('for x in BaseLayers', x);
            options.push(
                <a class="dropdown-item" onClick={()=>this.onTileProviderSelect(x)}>
                    {BaseLayers[x].friendlyName}
                </a>
            );
        }
        const dropDownMenu = (
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {options}
            </div>
        );
        return (
                <div class='container-fluid'>
                    <div class='row'>
                        <div class="dropdown col-sm">
                            <button class="btn btn-primary btn-lg dropdown-toggle"
                                type="button" id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                    Tiles provider
                            </button>
                           {dropDownMenu}
                         </div>
                    </div>
                    <Map tileProviderId={this.state.tileProviderId}/>
                </div>
        );
    }
}



export default App;

