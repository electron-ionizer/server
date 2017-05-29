import LocalStore from './local/LocalStore';

import { fileStrategy } from '../config';

let store: IFileStore;

switch (fileStrategy) {
    case 'local':
    default:
        store = new LocalStore();
}

export default store;