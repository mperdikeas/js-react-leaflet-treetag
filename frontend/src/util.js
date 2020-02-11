function theAnswer() {
    const rv = (()=>{
        return 42;
    })();
    return rv;
}

exports.theAnswer = theAnswer;
