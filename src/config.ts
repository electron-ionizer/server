import * as debug from 'debug';
import * as fs from 'fs-extra';
import * as NodeRsa from 'node-rsa';

const d = debug('ionized:config');
let config: IConfig = <any>{};

try {
    config =  require('../config');
} catch (err) {
    d('Could not locate config.js file, please ensure it exists');
    process.exit(1);
}

let generatedCerts: Buffer[];

export const port = config.port;
export const mongo: MongoOptions = <any>(config.mongo || {});
export const fileStrategy = config.fileStrategy;
export const dbStrategy = config.dbStrategy;

const getCertificates = async () => {
    if (!config.certificate) {
        d('Missing certificate config, please ensure the certificate property is set on your config file');
        process.exit(1);
    } else {
        if (config.certificate === 'generate') {
            if (!generatedCerts) {
                const key = new NodeRsa({ b: 2048 });
                key.generateKeyPair();
                d('Generating keypair: WARNING - This is very unsecure as a new keypair is generated every launch');
                generatedCerts = [Buffer.from(key.exportKey('public')), Buffer.from(key.exportKey('private'))];
                d('New keypair generated');
            }
            return generatedCerts;
        } else if (typeof config.certificate === 'object') {
            if (!await fs.pathExists(config.certificate.privateKeyPath) || !await fs.pathExists(config.certificate.publicKeyPath)){
                d('Could not locate certificate files, ensure your path is correct and absolute');
                process.exit(1);
            }
            const publicCert = await fs.readFile(config.certificate.publicKeyPath);
            const privateCert = await fs.readFile(config.certificate.privateKeyPath);
            return [publicCert, privateCert];
        } else {
            d('Invalid certificate reference in config:', config.certificate);
            process.exit(1);
        }
    }
}

export const getPublicKey = async () => (await getCertificates())[0];
export const getPrivateKey = async () => (await getCertificates())[1];
