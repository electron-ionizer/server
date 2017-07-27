import * as actions from '../actions/plugins';

const INITIAL_STATE = null;

export const plugins =  (state: PluginSubState = INITIAL_STATE, action) => {
    switch (action.type) {
        case actions.SET_PLUGINS:
            state = action.plugins;
            break;
    }
    return state;
}
