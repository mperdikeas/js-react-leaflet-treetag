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


exports.theAnswer  = theAnswer;
exports.exactlyOne = exactlyOne;
