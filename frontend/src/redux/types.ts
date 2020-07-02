import {BasicTreeInfoWithId
        , Configuration} from '../backend.d.ts';

import {ToastsReducerState}     from './reducers/toast-reducer.ts';
import {TargetReducerState}     from './reducers/target-reducer.ts';
import {RegionsReducerState}    from './reducers/regions-reducer.ts';
import {Modal}                  from './reducers/modal-reducer.ts';


export type RootState = { // todo adorn with readonly
    configuration: Configuration | undefined,
    trees: BasicTreeInfoWithId[],
    toasts: ToastsReducerState,
    target: TargetReducerState,
    modals: Modal[],
    maximizedInfoPanel: boolean,
    latlng: {
        lat: number,
        lng: number},
    paneToOpenInfoPanel: string, // todo: use enum
    regions: RegionsReducerState
}