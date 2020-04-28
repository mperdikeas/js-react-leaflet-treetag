const assert = require('chai').assert;

function possiblyInsufPrivPanicInAnyCase(err) {
    console.log(err);
    console.log(JSON.stringify(err));
    if (err.response) {
        if (err.response.data.code == 'insufficient-privileges') {
            console.log(err.response);
            assert.fail(`impossible that I get INSUFFICIENT_PRIVILLEGES for this method`);
        } else {
            assert.fail('you know what? any other code at this point is also impossible');
        }
        assert.fail("also, even if error.response is not present, guess what? that's also not possible");
    }
}

exports.possiblyInsufPrivPanicInAnyCase = possiblyInsufPrivPanicInAnyCase;

