interface CertificateObject {
    publicKeyPath: string;
    privateKeyPath: string;
}

interface MongoOptions {
    uri: string;
    username: string;
    password: string;
}


interface GitHubOptions {
    clientID: string;
    clientSecret: string;
    realm: string;
}

interface OpenIDOptions {
    returnURL: string;
    realm: string;
    providerURL: string;
    stateless: boolean;
    profile: boolean;
    domain: string;
}

interface IConfig {
    name: string;
    port: number;
    certificate?: (string | CertificateObject);
    mongo: MongoOptions;
    fileStrategy: string;
    dbStrategy: string;
    authStrategy: string;
    github: GitHubOptions;
    openid: OpenIDOptions;
    secret: string;
    adminIdentifiers: string[];
}

interface User {
    id: string;
    displayName: string;
    photos?: { value: string }[],
    isAdmin: boolean;
}

interface IErrorObject {
    [key: string]: string
}

type FileID = string;

interface IDBDriver {
    ensureConnected(): Promise<void>;
    getPlugins(): Promise<IonizerPlugin[]>;
    createPlugin(author: User, name: string, description: string): Promise<IonizerPlugin>;
    resetPluginToken(pluginId: string): Promise<IonizerPlugin>;
    getPlugin(id: string): Promise<IonizerPlugin>;
    createVersion(pluginId: string, version: string, fileIdentifier: FileID, hash: string): Promise<PluginVersion>;
    validatePluginVersion(plugin: IonizerPlugin, version: PluginVersion): Promise<PluginVersion>;
}

interface PluginVersion {
    version: string;
    fileIdentifier: string;
    hash: string;
    publishDate: Date;
    downloads: number;
    validated: boolean;
}

interface IonizerPlugin {
    id: string;
    author: User;
    name: string;
    description: string;
    versions: PluginVersion[];
    token?: string;
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
