import * as mongoose from 'mongoose';

const { Schema } = mongoose;
 
const Plugin = new Schema({
    id: (<any>Schema).ObjectId,
    author: String,
    name: String,
    versions: {
        type: [
            {
                version: String,
                fileIdentifier: String,
                hash: String,
                publishDate: Date,
                downloads: Number,
                validated: { type: Boolean, default: false },
            }
        ],
        default: [],
    },
});

export default mongoose.model('Plugin', Plugin);

export interface IPluginVersion extends PluginVersion {}

export interface IPluginDocument extends mongoose.Document, Plugin {}
