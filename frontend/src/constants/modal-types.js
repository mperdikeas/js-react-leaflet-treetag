// TODO: this has to be modified to take the form of a structured object with properties

export const MDL_LOGIN            = 'MDL_LOGIN';
export const MDL_SAVE_WS_2_DSK    = 'MDL_SAVE_WS_2_DSK';  // Modal Save Workspace to Disk
export const MDL_INS_GJSON_2_WS   = 'MDL_INS_GJSON_2_WS'; // Modal Insert GeoJSON to Workspace
export const MDL_USERNAME_REMINDER = 'MDL_USERNAME_REMINDER';
export const MDL_NOTIFICATION      = 'MDL_NOTIFICATION';
export const MDL_NOTIFICATION_NO_DISMISS      = 'MDL_NOTIFICATION_NO_DISMISS';
export const MDL_WKSPACE_IS_EMPTY = 'MDL_WKSPACE_IS_EMPTY';
export const MDL_QUERY            = 'MDL_QUERY';
export const MDL_RETRY_CANCEL     = 'MDL_RETRY_CANCEL';
export const MDL_NEW_REGION_DEFINITION = 'MDL_NEW_REGION_DEFINITION';
export function isValidModalType(modalType) {
    const validModalTypes = [    MDL_LOGIN
                                 , MDL_SAVE_WS_2_DSK
                                 , MDL_INS_GJSON_2_WS
                                 , MDL_USERNAME_REMINDER
                                 , MDL_NOTIFICATION
                                 , MDL_NOTIFICATION_NO_DISMISS
                                 , MDL_WKSPACE_IS_EMPTY
                                 , MDL_QUERY
                                 , MDL_RETRY_CANCEL
                                 , MDL_NEW_REGION_DEFINITION];
    return (validModalTypes.indexOf(modalType)!==-1);
}

