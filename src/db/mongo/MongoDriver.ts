import * as mongoose from 'mongoose';

import { mongo } from '../../config';

import Plugin, { IPluginDocument } from './schema/Plugin';
import store from '../../files/store';

export default class MongoDriver implements IDBDriver {
    private connected: boolean;
    
    public async ensureConnected() {
        if (!this.connected) {
            (<any>mongoose).Promise = global.Promise;
            await mongoose.connect(mongo.uri, {
                user: mongo.username,
                pass: mongo.password,
            });
            this.connected = true;
        }
    }

    public async getPlugins() {
        await this.ensureConnected();
        return (<IPluginDocument[]>(await Plugin.find({}))).map(plugin => plugin.toJSON());
    }

    public async createPlugin(author: string, name: string) {
        await this.ensureConnected();
        const plugin = <IPluginDocument>(new Plugin());
        plugin.author = author;
        plugin.name = name;
        await plugin.save();
        return plugin.toJSON();
    }

    private async getRawPlugin(id: string) {
        await this.ensureConnected();
        try {
            return (<IPluginDocument>(await Plugin.findById(id)));
        } catch (err) {
            return null;
        }
    }

    public async getPlugin(id: string) {
        const plugin = await this.getRawPlugin(id);
        return plugin ? plugin.toJSON() : null;
    }

    public async createVersion(pluginId: string, version: string, fileIdentifier: FileID, hash: string) {
        if (!await store.exists(fileIdentifier)) {
            throw new Error('Can\'t make a version with a non-existent file');
        }
        const plugin = await this.getRawPlugin(pluginId);
        if (!plugin) {
            throw new Error('Can\t make a version for a non-existent plugin');
        }
        const newVersion: PluginVersion = {
            downloads: 0,
            fileIdentifier,
            hash,
            publishDate: new Date(),
            version,
        };
        plugin.versions.push(newVersion);
        await plugin.save();
        return newVersion;
    }
}
