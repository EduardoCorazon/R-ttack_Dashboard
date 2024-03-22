import {createStore} from 'redux';

const metadataReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_METADATA':
            return action.payload;
        default:
            return state;
    }
};
const store = createStore(metadataReducer);
export default store;