import {getRegions} from '../../region-list-util.jsx';

const assert = require('chai').assert;

export function selectedRegions(state) {

    const {val, selected} = state.regions;
    assert.isOk(val);
    assert.isOk(selected);
    return getRegions(val, selected);


}
