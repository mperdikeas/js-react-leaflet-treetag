import {globalGet, GSN} from './globalStore.js';

import chai from './util/chai-util.js';
const assert = chai.assert;


export default class TreeCountStatistic {

    constructor() {
        this.kind2count = {};
    }

    increment(kind) {
        if (!this.kind2count.hasOwnProperty(kind))
            this.kind2count[kind] = 0;
        this.kind2count[kind]++;
    }


    total() {
        let rv = 0;
        for (var kind in this.kind2count) {
            if (Object.prototype.hasOwnProperty.call(this.kind2count, kind)) {
                rv += this.kind2count[kind];
            }
        }
        return rv;
    }

    toDetailBreakdownString(treesConfiguration) {
        const rv = [];
        for (var kind in this.kind2count) {
            if (Object.prototype.hasOwnProperty.call(this.kind2count, kind)) {
                rv.push(numberAndKindDescr(treesConfiguration, this.kind2count[kind], kind));
            }
        }
        return rv.join(', ');
    }

}

function numberAndKindDescr(treesConfiguration, number, kind) {
    const msg = 'at the time of this writing it was considered unfathomable that the TreesConfigurationContextProvider'
        +'will not have obtained the treesConfiguration by this point';
    assert.isNotNull(treesConfiguration, msg);
    assert.isDefined(treesConfiguration, msg);
    const {singular, plural} = treesConfiguration[kind].name;
    return `${number} ${number==1?singular:plural}`;
}
