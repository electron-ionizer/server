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
                downloads: Number
            }
        ],
        default: [],
    },
});

export default mongoose.model('Plugin', Plugin);

export interface IPluginVersion extends PluginVersion {
    version: string;
    fileIdentifier: string;
    hash: string;
    publishDate: Date;
    downloads: number;
}

export interface IPluginDocument extends mongoose.Document, Plugin {
    id: string;
    author: string;
    name: string;
    versions: IPluginVersion[];
}
