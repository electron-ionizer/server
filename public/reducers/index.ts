import { combineReducers } from 'redux';

import { user } from './user';
import { app } from './app';
import { plugins } from './plugins';

export default combineReducers({
    user,
    app,
    plugins,
});
