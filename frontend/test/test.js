import {assert} from 'chai';
import AssertionError  from 'assertion-error';
assert.isOk(AssertionError);


import {theAnswer} from '../src/util.js';


describe('level 1', function () {
    describe('level 2', function() {
        describe('level 3', function() {
            it('it works', function() {
                assert.strictEqual(42, theAnswer());
            });
        });
    });
});
