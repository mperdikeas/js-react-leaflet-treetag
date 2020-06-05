function urlForFeat(id) {
    return `/feature/${id}`;
}


export function urlForFeatData(id) {
    return `${urlForFeat(id)}/data`;
}

function urlForPhotos(id) {
    return `${urlForFeat(id)}/photos`;
}


export function urlForPhoto(id, indx) {
  return `${urlForPhotos(id)}/elem/${indx}`;
}

export function urlForPhotoDeletion(id, indx) {
  return urlForPhoto(id, indx);
}



export function urlForNumOfPhotos(id) {
    return `${urlForPhotos(id)}/num`;
}
