import {getRegions} from '../../region-list-util.jsx';

const assert = require('chai').assert;

export function selectedRegions(state) {

    const {val, selected} = state.regions;
    assert.isOk(val);
    assert.isOk(selected);
    const rv =  getRegions(val, selected);
    console.log('selected regions are: ', rv);
    return rv;
}
