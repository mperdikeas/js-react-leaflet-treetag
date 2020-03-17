function theAnswer() {
    const rv = (()=>{
        return 42;
    })();
    return rv;
}



function exactlyOne(...theArgs) {
    const truthyCount = theArgs.reduce( (previous, current) => {
        return previous + (!!current);
    }, 0);
    return truthyCount == 1;
}

function sca_fake_return() {
    return 'returning this just to satisfy Static Code Analysis';
}


exports.theAnswer  = theAnswer;
exports.exactlyOne = exactlyOne;
exports.sca_fake_return = sca_fake_return;
