import * as mongoose from 'mongoose';

const { Schema } = mongoose;
 
const Plugin = new Schema({
    id: (<any>Schema).ObjectId,
    author: {
        id: String,
        displayName: String,
        photos: [
            {
                value: String,
            }
        ],
        isAdmin: Boolean,
    },
    name: { type: String, required: true },
    description: { type: String, default: '' },
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
    token: String,
});

export default mongoose.model('Plugin', Plugin);

export interface IPluginVersion extends PluginVersion {}

export interface IPluginDocument extends mongoose.Document, IonizerPlugin {}
