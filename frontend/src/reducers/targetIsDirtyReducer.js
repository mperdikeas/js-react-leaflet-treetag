import {MARK_TARGET_AS_DIRTY, MARK_TARGET_AS_CLEAN} from '../constants/action-types.js';

export default (state = false, action) => {
    switch (action.type) {
    case MARK_TARGET_AS_DIRTY:
        console.log('xyz - marking target as dirty');
        return true;
    case MARK_TARGET_AS_CLEAN:
        console.log('xyz - marking target as clean');
        return false;
    default:
        return state;
    }
}
