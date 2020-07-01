import {BasicTreeInfoWithId
        , PartitionsForInstallation
        , Configuration} from '../backend.d.ts';

import {EditingRegionsReducerState} from './reducers/editing-regions-reducer.ts';
import {TargetReducerState} from './reducers/target-reducer.ts';

export type RootState = { // todo adorn with readonly
    configuration: Configuration | undefined
    trees: BasicTreeInfoWithId[]
    target: TargetReducerState,
    maximizedInfoPanel: boolean
    latlng: {
        lat: number,
        lng: number},
    paneToOpenInfoPanel: string, // todo: use enum
    regions: {existing: PartitionsForInstallation
              , editing: EditingRegionsReducerState
              , overlaps: any} | null
    
}