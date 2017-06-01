module.exports = {
    /**
     * THe port to run Ionizer Server on, if the port is in use the server will not start
     */
    port: 3030,

    /**
     * Certificate mode, you should NEVER use "generate" in production as restarts will generate new
     * certificates and therefore render all previously uploaded plugins useless, in production you
     * should use the certificate object structure demonstrated below.
     */
    certificate: 'generate',
    // certificate: {
    //     publicKeyPath: '',
    //     privateKeyPath: '',
    // },

    /**
     * The data store to use when persisting plugins and versions.  Current possible values are "mongo",
     * ensure you also supply valid connection details for you chosen strategy below.
     * 
     * PR's welcome to add another data store.
     */
    dbStrategy: 'mongo',

    /**
     * Mongo connection information
     * 
     * uri: The mongodb:// URI used to connect to your cluster
     * username: Username for your cluster
     * password: Password for your cluster
     */
    mongo: {
        uri: '',
        username: '',
        password: ''
    },

    /**
     * The file store to use when persisting plugin ASAR files.  Current possible values are "local",
     * ensure you also supply valid connection details if required for your chosen stragey below.
     * 
     * PR's welcome to add another file store.
     */
    fileStrategy: 'local'
};
