const chai = require('chai');
chai.Assertion.includeStack = true; // https://stackoverflow.com/a/13396945/274677
chai.config.includeStack = true;
export default chai;
