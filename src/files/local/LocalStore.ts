import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';

export default class LocalStore implements IFileStore {
    private root: string;

    constructor() {
        this.root = path.resolve(__dirname, '../../../.filestore');
    }

    public async exists(id: FileID): Promise<boolean> {
        const filePath = path.resolve(this.root, id);
        return await fs.pathExists(filePath);
    }

    public async save(content: Buffer, name: string): Promise<[FileID, string]> {
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const fileDir = path.resolve(this.root, hash);
        const id: FileID = path.join(hash, name);
        if (!await this.exists(id)) {
            await fs.mkdirs(fileDir);
            await fs.writeFile(path.resolve(fileDir, name), content);
        }
        return [id, hash];
    }

    public async handleDownloadRequest(id: FileID, response: Express.Response): Promise<void> {
        if (!await this.exists(id)) {
            throw new Error(`FileID "${id}" does not exist`);
        }
        response.download(path.resolve(this.root, id));
    }
}