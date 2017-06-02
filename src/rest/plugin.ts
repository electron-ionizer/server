import * as express from 'express';
import * as NodeRsa from 'node-rsa';
import * as semver from 'semver';

import driver from '../db/driver';
import store from '../files/store';

import { getPrivateKey } from '../config';

const router = express();

const checkField = (req: Express.Request, res: Express.Response, field: string) => {
    if (!req.body) {
        res.status(400).json({
            error: 'Missing POST body',
        });
        return false;
    }
    if (!req.body[field]) {
        res.status(400).json({
            error: `Missing required body param: "${field}"`,
        });
        return false;
    }
    return true;
};
const checkFields = (req: Express.Request, res: Express.Response, fields: string[]) => {
    for (const field of fields) {
        if (!checkField(req, res, field)) {
            return false;
        }
    }
    return true;
};

router.get('/', async (req, res) => {
    res.json(await driver.getPlugins());
});

router.post('/', async (req, res) => {
    if (checkFields(req, res, ['author', 'name'])) {
        res.json(await driver.createPlugin(req.body.author, req.body.name));
    }
});

router.get('/:id', async (req, res) => {
    res.json(await driver.getPlugin(req.params.id));
});

router.post('/:id/version', async (req, res) => {
    if (checkFields(req, res, ['version'])) {
        if (!req.files || !req.files.asar) {
            res.status(400).json({
                error: 'Missing "asar" file attachment',
            });
        } else {
            const version = req.body.version;
            if (!semver.valid(version)) {
                res.status(400).json({
                    error: 'Provided version must follow semver',
                });
            } else {
                const plugin = await driver.getPlugin(req.params.id);
                if (!plugin) {
                    res.status(400).json({
                        error: 'Can\'t create a version for a non-existant plugin',
                    })
                } else if (plugin.versions.find(tVersion => semver.gte(tVersion.version, version))) {
                    res.status(400).json({
                        error: 'Can\'t create a version that is semantically less than an existing version',
                    });
                } else {
                    const key = new NodeRsa();
                    key.importKey(await getPrivateKey());
                    const safeData = key.encryptPrivate(req.files.asar.data);

                    const [fileIdentifier, hash] = await store.save(safeData, req.files.asar.name);
                    res.json(await driver.createVersion(req.params.id, version, fileIdentifier, hash));
                }
            }
        }
    }
});

router.post('/:id/version/:hash/validate', async (req, res) => {
    const plugin = await driver.getPlugin(req.params.id);
    if (!plugin) {
        res.status(404).send();
    }
    const version = plugin.versions.find(v => v.version === req.params.hash);
    if (!version) {
        res.status(404).send();
    }
    res.json(await driver.validatePluginVersion(plugin, version));
});

router.get('/:id/version/:hash/download', async (req, res) => {
    const plugin = await driver.getPlugin(req.params.id);
    if (!plugin) {
        res.status(404).send();
    }
    const version = plugin.versions.find(v => v.version === req.params.hash);
    if (!version) {
        res.status(404).send();
    }
    store.handleDownloadRequest(version.fileIdentifier, res);
});

export default router;