import {assert} from 'chai';
import AssertionError  from 'assertion-error';
assert.isOk(AssertionError);


import {theAnswer, onlyOne} from '../src/util.js';


describe('level 1', function () {
    describe('level 2', function() {
        describe('level 3', function() {
            it('it works', function() {
                assert.strictEqual(42, theAnswer());
            });
        });
    });
});


describe('onlyOne', function () {
    it('it works', function() {
        assert.strictEqual(false, onlyOne(false, false, false));        
        assert.strictEqual(false, onlyOne(true, true, false));
        assert.strictEqual(true, onlyOne(false, false, true));
        assert.strictEqual(true, onlyOne(false, true, false));
        assert.strictEqual(true, onlyOne(true, false, false));

        assert.strictEqual(false, onlyOne(false, false, true, false, true));
        assert.strictEqual(true, onlyOne(false, false, true, false));
    });
});
