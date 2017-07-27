import * as express from 'express';
import * as NodeRsa from 'node-rsa';
import * as semver from 'semver';

import driver from '../db/driver';
import store from '../files/store';

import { getPrivateKey } from '../config';

const router = express();

const requireLogin = (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: 'Forbidden' });
    next();
};

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

const stripTokens = <T>(plugin: T): T => {
    let plugins: any[];
    if (!Array.isArray(plugin)) {
        plugins = [plugin];
    } else {
        plugins = plugin;
    }
    for (const plugin of plugins) {
        delete (<any>plugin).token;
    }
    if (!Array.isArray(plugin)) {
        return plugins[0];
    } else {
        return (<any>plugins);
    }
}

router.get('/', async (req, res) => {
    res.json(stripTokens(await driver.getPlugins()));
});

router.post('/', requireLogin, async (req, res) => {
    if (checkFields(req, res, ['author', 'name', 'description'])) {
        res.json(stripTokens(await driver.createPlugin(req.user as User, req.body.name as string, req.body.description)));
    }
});

router.get('/:id', async (req, res) => {
    res.json(stripTokens(await driver.getPlugin(req.params.id)));
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
                    res.status(404).json({
                        error: 'Can\'t create a version for a non-existant plugin',
                    })
                } else if (!((!req.user && req.headers.Authorization === `Token ${plugin.token}`) || (req.user && plugin.author.id === (<User>req.user).id))) {
                    res.status(403).json({ error: 'Forbidden' });
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

router.get('/:id/token', requireLogin, async (req, res) => {
    const plugin = await driver.getPlugin(req.params.id);
    if (!plugin) {
        res.status(404).json({
            error: 'Can\'t fetch a token for a non-existant plugin',
        });
    } else if (plugin.author.id !== (<User>req.user).id) {
        res.status(403).json({ error: 'Forbidden' });
    } else {
        res.json({ token: (await driver.resetPluginToken(req.params.id)).token });
    }
});

router.post('/:id/token/reset', requireLogin, async (req, res) => {
    const plugin = await driver.getPlugin(req.params.id);
    if (!plugin) {
        res.status(404).json({
            error: 'Can\'t reset a token for a non-existant plugin',
        });
    } else if (plugin.author.id !== (<User>req.user).id) {
        res.status(403).json({ error: 'Forbidden' });
    } else {
        res.json({ token: (await driver.resetPluginToken(req.params.id)).token });
    }
});

router.post('/:id/version/:hash/validate', requireLogin, async (req, res) => {
    if (!(<User>req.user).isAdmin) return res.status(403).json({ error: 'Forbidden '});

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