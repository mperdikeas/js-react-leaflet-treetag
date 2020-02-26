const initialState = {
    tileProviderId: 'esri'
    , maximizedInfo: false
    , target: null
    , coords: null
};

function rootReducer(state = initialState, action) {
    if (action.type === 'SELECT_TARGET') {
        return Object.assign({}, state,
                             {
                                 target: action.payload
                             });
    }
    return state;
};

export default rootReducer;
