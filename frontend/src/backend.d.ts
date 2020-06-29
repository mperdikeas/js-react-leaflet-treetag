export type Coordinates = {
    longitude: number;
    latitude: number;

}

export interface BasicTreeInfo {
    kind: number;
    coords: Coordinates;
};


export type TreeAction = {
    instant: number;
    type: number;
}


export interface TreeInfo extends BasicTreeInfo {

    yearPlanted: number;
    healthStatus: number;
    
    heightCm: number;
    crownHeightCm: number;
    circumferenceCm: number;
    raisedSidewalk: boolean;
    powerlineProximity: boolean;
    obstruction: boolean;
    debris: boolean;
    litter: boolean;
    trunkDamage: boolean;
    fallHazard: boolean;
    publicInterest: boolean;
    disease: boolean;
    comments: string;
    treeActions: TreeAction[];
};


export interface TreeInfoWithId extends TreeInfo {
    id: number;
}


export type BackendResponse = {
    data: {t: any, err: any}
}


