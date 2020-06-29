import React, {Dispatch} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {cancelToken} from '../selectors.ts';

import {OP_NO_LONGER_RELEVANT} from '../../util/axios-util.js';

import {clearModal} from './index.ts';

import {RootState} from '../types.ts';


export function cancelPendingRequests(state: RootState) {
  /* If there are any pending axios requests we have to cancel them.
   */
  const cancelTokenV = cancelToken(state);
  if (cancelTokenV) {
    cancelTokenV.cancel(OP_NO_LONGER_RELEVANT);
    console.debug('action-util.tsx :: cancelPendingRequests: cancelled axios request');
  } else
  console.debug('action-util.tsx :: cancelPendingRequests: NO cancel token found');
}

function htmlForServerErrorMessage(url: string, actionCreator: string, ctx: string, err: Object) {
  return (
    <>
    <div>
      Some server-side problem was encountered while accessing:<br/>
      <span style={{fontFamily:'monospace'}}>{url}</span>
    </div>
    <div style={{marginBottom: '1em'}}>
      If the problem persists, contact support with the below details:
    </div>
    <div style={{border: '1px solid black'}}>
      action-creator: {actionCreator}
    </div>
    <div style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
      context: {ctx}
    </div>
    <div style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>
      time: {(new Date()).getTime()/1000}
    </div>
    <div style={{border: '1px solid black'
               , padding: '0.3em'
               , background: 'gainsboro'
               , color: 'red'
               , fontSize: '110%'
               , overflowX: 'auto'
               , fontFamily: 'monospace'}}>
      {JSON.stringify(err)}
    </div>
    </>
  );
}

export function propsForRetryDialog(dispatch: Dispatch<any>, f: ()=>void, url: string, actionCreator: string, ctx: string, err: Object) {
  const html = htmlForServerErrorMessage(url, actionCreator, ctx, err);
  const uuid = uuidv4();
  const cancelAction = ()=>dispatch(clearModal(uuid));
  const retryAction = ()=>{dispatch(clearModal(uuid)); f()};
  return {html, uuid, cancelAction, retryAction};
}
