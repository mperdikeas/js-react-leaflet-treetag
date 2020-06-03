export function urlForPhotoDeletion(targetId, indx) {
  return urlForPhoto(targetId, indx);
}

export function urlForPhoto(targetId, indx) {
  const url = `/feature/${targetId}/photos/elem/${indx}`;
  return url;
}


export function urlForNumOfPhotos(targetId) {
  const url=`/feature/${targetId}/photos/num`;
  return url;
}
