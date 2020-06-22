import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {OVERLAPS_SET_REGION,
        OVERLAPS_SET_PARTITIONS,
        OVERLAPS_GET_OVERLAPS_IN_PROGRESS,
        OVERLAPS_GET_OVERLAPS_SUCCESS}  from '../actions/action-types.js';

import {sca_fake_return} from '../../util/util.js';

import {convert} from './reducer-util.js';


/* undefined means it's being fetched, null or empty array (if applicable) means it was fetched and is empty
 * if something is never fetched (e.g. it is selected by the user) then it never takes the value undefined
 * and only the value 'null' is applicable in that case.
 * 
 * cf. sse-1592816552
 *
 */
export default (state = {selected: undefined
                           , partitions: undefined
                           , overlaps: undefined}, action) => {
                               switch (action.type) {
                               case OVERLAPS_SET_REGION:
                                   return Object.assign({}, state, {selected: action.payload});
                               case OVERLAPS_SET_PARTITIONS:
                                   return Object.assign({}, state, {partitions: action.payload});

                               case OVERLAPS_GET_OVERLAPS_IN_PROGRESS:
                                   return Object.assign({}, state, {overlaps: undefined});
                               case OVERLAPS_GET_OVERLAPS_SUCCESS:
                                   return Object.assign({}, state, {overlaps: action.payload});
                                   
                               default:
                                   return state;
                               }
                           }

