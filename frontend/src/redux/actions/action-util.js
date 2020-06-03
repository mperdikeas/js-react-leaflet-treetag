import {cancelToken} from '../selectors.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';


export function cancelPendingRequests(state) {
    /* If there are any pending axios requests we have to cancel them.
     */
    const cancelTokenV = cancelToken(state);
    if (cancelTokenV) {
        cancelTokenV.cancel(OP_NO_LONGER_RELEVANT);
        console.log('abf :: cancelPendingRequests: cancelled axios GET request due to unsetting of target');
    } else
        console.log('abf :: cancelPendingRequests: no cancel token found');
}
