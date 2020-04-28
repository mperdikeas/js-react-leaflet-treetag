const assert = require('chai').assert;

const INSUF_PRIV = 'insufficient-privileges';

function possiblyInsufPrivPanicInAnyCase(err) {
    console.log(err);
    console.log(JSON.stringify(err));
    if (err.response) {
        if (err.response.data) {
            if (err.response.data.code == INSUF_PRIV) {
                console.log(err.response);
                assert.fail(`impossible that I get INSUFFICIENT_PRIVILLEGES for this method`);
            } else {
                assert.fail('you know what? any other code at this point is also impossible');
            }
        } else
            assert.fail("error.response.data is not present - that's not possible");
        assert.fail("error.response is not present - that's not possible");
    }
}

function isInsufficientPrivilleges(err) {
    if (err && err.response && err.response.data && (err.response.data.code===INSUF_PRIV))
        return true;
    else
        return false;
}

exports.possiblyInsufPrivPanicInAnyCase = possiblyInsufPrivPanicInAnyCase;
exports.isInsufficientPrivilleges       = isInsufficientPrivilleges;

