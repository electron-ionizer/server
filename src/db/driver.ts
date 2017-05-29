import MongoDriver from './mongo/MongoDriver';

import { dbStrategy } from '../config';

let driver: IDBDriver;

switch (dbStrategy) {
    case 'mongo':
    default:
        driver = new MongoDriver();
}

export default driver;