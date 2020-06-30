//import {CancelTokenSource} from 'axios';
//import CancelToken from '../../node_modules/axios/lib/cancel/CancelToken.js';
import {CancelTokenSource} from '../../node_modules/axios/index.d.ts';

import {TreeInfoWithId} from '../backend.d.ts';
export type RootState = { // todo adorn with readonly
    configuration: {
        healthStatuses: any[]
    },
    target: {
        id: number | null,
        treeInfo: {original: TreeInfoWithId
                   , current: TreeInfoWithId
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