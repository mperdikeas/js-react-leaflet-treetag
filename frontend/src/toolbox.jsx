const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console

const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const assert = require('chai').assert;

require('./toolbox.css');

import selectMarker  from './resources/select-marker-32.png';
import definePolygon from './resources/polygon-tool-32.png';
import remove        from './resources/andrew-cross-32.png';
import moveVertex    from './resources/move-vertex-32.png';

import {SELECT_TOOL, DEFINE_POLYGON_TOOL, MOVE_VERTEX_TOOL, REMOVE_TOOL} from './map-tools.js';



class Toolbox extends React.Component {


    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
    }

    chooseSelectMarker = (e) => {
        e.preventDefault();
        this.props.updateSelectedTool(SELECT_TOOL);
    }

    chooseDefinePolygon = (e) => {
        e.preventDefault();
        this.props.updateSelectedTool(DEFINE_POLYGON_TOOL);
    }

    chooseMoveVertex = (e) => {
        e.preventDefault();
        this.props.updateSelectedTool(MOVE_VERTEX_TOOL);
    }

    chooseRemove = (e) => {
        e.preventDefault();
        this.props.updateSelectedTool(REMOVE_TOOL);
    }
    

    render = () => {
        console.log('toolbox', this.props);
        const tools = [{icon:selectMarker , f: this.chooseSelectMarker}
                       , {icon:definePolygon, f: this.chooseDefinePolygon}
                       , {icon:moveVertex   , f: this.chooseMoveVertex}
                       , {icon:remove       , f: this.chooseRemove}];
        
        const style = {display: 'block'
                       , margin: 'auto'
                       , width: 40
                       , boxSizing: 'border-box'};
        const styleFirstIcon       = Object.assign({}, style, {marginTop: '100px'});
        const styleSubsequentIcons = Object.assign({}, style, {marginTop: '10px'});

        const self = this;
        const elems = tools.map( (el, idx) => {
            const applicableStyle1 = (idx===0)?styleFirstIcon:styleSubsequentIcons;
            const applicableStyle2 = Object.assign({}
                                                   , applicableStyle1
                                                   , (idx===self.props.selectedTool)?{border: '3px solid red'}:{});

            return (
                    <div class='col-12'>
                    <a href='/' onClick={el.f}>
                    <img  src={el.icon} style={applicableStyle2}/>
                    </a>
                    </div>        
            );
        });

        return (
                <div class='row no-gutters'>
                {elems}
            </div>
        );
    }
}



export default Toolbox;

