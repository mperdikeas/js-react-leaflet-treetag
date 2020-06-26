//import {CancelTokenSource} from 'axios';
//import CancelToken from '../../node_modules/axios/lib/cancel/CancelToken.js';
import {CancelTokenSource} from '../../node_modules/axios/index.d.ts';

import {TreeInfo} from '../backend.d.ts';
export type RootState = { // todo adorn with readonly
    target: {
        id: number | null,
        treeInfo: {original: TreeInfo
                   , current: TreeInfo
                  } | null,
        photos: {num: number
                 , idx: number
                 , img: string
                 , t: number} | null,
        axiosSource: CancelTokenSource
    },
    maximizedInfoPanel: boolean
    latlng: {
        lat: number,
        lng: number},
    paneToOpenInfoPanel: string // todo: use enum
    
}