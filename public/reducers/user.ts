import * as actions from '../actions/user';

const INITIAL_STATE = {
    signedIn: false,
}

export const user =  (state: UserSubState = INITIAL_STATE, action) => {
    switch (action.type) {
        case actions.LOG_OUT:
            state = INITIAL_STATE;
            break;
        case actions.SET_USER:
            state.user = action.user;
            state.signedIn = !!action.user;
            break;
    }
    return state;
}
