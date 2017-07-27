import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as express from 'express';

import { name, port, getPublicKey } from './config';
import driver from './db/driver';
import pluginRouter from './rest/plugin';
import { authenticateRouter, setupApp } from './rest/auth';

const fileUpload = require('express-fileupload');

const d = debug('ionizer');

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.error = (err) => {
        d('An error occurred inside Ionizer:', err);
        res.status(500).send();
    };
    next();
});

const restRouter = express();
restRouter.get('/healthcheck', (req, res) => res.json({ alive: true }));
restRouter.use('/plugin', pluginRouter);
restRouter.use('/auth', authenticateRouter);
setupApp(app);

restRouter.get('/public', async (req, res) => {
    res.json({
        key: (await getPublicKey()).toString(),
    });
});
restRouter.get('/config', async (req, res) => {
    res.json({
        app: { name },
        user: req.user,
    });
});

app.use('/rest', restRouter);

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Unknown Path'
    });
});

d('Setting up server');
(async () => {
    d('Connecting to MongoDB');
    await driver.ensureConnected();
    d('Reading keypair settings');
    await getPublicKey();
    app.listen(port, () => {
        d('Ionizer Server started on port:', port);
    });
})();
