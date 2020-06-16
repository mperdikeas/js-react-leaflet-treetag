import chai from '../../util/chai-util.js';
const assert = chai.assert;

// ReGion Editing mode
export const RGE_MODE = {UNENGAGED: 'unengaged', CREATING: 'creating', MODIFYING: 'modifying'};
export function ensureRGEModeIsValid(mode) {
    assert.isTrue(Object.values(RGE_MODE).includes(mode)
                  , `unrecognized mode: '${mode}'`);
}
