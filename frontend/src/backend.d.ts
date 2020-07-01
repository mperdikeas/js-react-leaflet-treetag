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

export type FeatPhoto = {
    imageBase64: string;
    instant: number;
};

export type LoginResult = {
    accessToken: string;
    loginFailureReason: string;
};

export type PartitionsForInstallation = Record<string, Record<string, Region>>;

export type BackendResponse<T> = {
    data: {t: T, err: any}
}


export type Region = {
    name: string,
    wkt: string
}