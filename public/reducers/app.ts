import * as actions from '../actions/app';

const INITIAL_STATE = {
    name: '',
}

export const app =  (state: AppSubState = INITIAL_STATE, action) => {
    switch (action.type) {
        case actions.SET_APP:
            state = action.app;
            break;
    }
    return state;
}
