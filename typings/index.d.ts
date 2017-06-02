interface CertificateObject {
    publicKeyPath: string;
    privateKeyPath: string;
}

interface MongoOptions {
    uri: string;
    username: string;
    password: string;
}

interface IConfig {
    port: number;
    certificate?: (string | CertificateObject);
    mongo: MongoOptions;
    fileStrategy: string;
    dbStrategy: string;
}

interface IErrorObject {
    [key: string]: string
}

type FileID = string;

interface IDBDriver {
    ensureConnected(): Promise<void>;
    getPlugins(): Promise<Plugin[]>;
    createPlugin(author: string, name: string): Promise<Plugin>;
    getPlugin(id: string): Promise<Plugin>;
    createVersion(pluginId: string, version: string, fileIdentifier: FileID, hash: string): Promise<PluginVersion>;
    validatePluginVersion(plugin: Plugin, version: PluginVersion): Promise<PluginVersion>;
}

interface PluginVersion {
    version: string;
    fileIdentifier: string;
    hash: string;
    publishDate: Date;
    downloads: number;
    validated: boolean;
}

interface Plugin {
    id: string;
    author: string;
    name: string;
    versions: PluginVersion[];
}

interface IFileStore {
    exists(id: FileID): Promise<boolean>;
    save(content: Buffer, name: string): Promise<[FileID, string]>;
    handleDownloadRequest(id: FileID, response: Express.Response): Promise<void>;
}

declare namespace Express {
    interface Response {
        error(err: IErrorObject): void;
        download(path: string): void;
        status(code: number): Response;
        json(obj: any): Response;
    }

    interface Request {
        body: any;
        files: {
            [name: string]: {
                name: string;
                mv: (to: string) => void;
                mimetype: string;
                data: Buffer;
            }
        };
    }
}
