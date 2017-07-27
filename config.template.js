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
    fileStrategy: 'local',

    /**
     * The authentication strategy to use when logging users in.  Current possible values are "openid"
     * and "github".  Make you also supply the required authentication details 
     */
    authStrategy: 'openid',

    /**
     * OpenID authentication details
     * 
     * The `adminIdentifiers` array should be a list of email
     * addresses for users to consider admins
     * 
     * realm: The domain that the server is hosted on
     * stateless: Stateless mode for openID
     * profile: Whether to fetch profile information, should noramlly be true 
     * providerURL: Your openID provider URL
     * domain: Domain to restrict email addresses to
     */
    openid: {
        realm: 'http://localhost:8888',
        stateless: true,
        profile: true,
        providerURL: 'https://auth.myservice.com/openid/v2/op',
        domain: 'gmail.com'
    },

    /**
     * GitHub authentication details
     * 
     * The `adminIdentifiers` array should be a list of GitHub usernames
     * to consider admins
     * 
     * clientID: GitHub API client ID
     * clientSecret: GitHub API clientSecret
     * realm: The domain the server is hosted on
     */
    github: {
        clientID: '',
        clientSecret: '',
        realm: 'http://localhost:8888'
    },

    /**
     * Session cookie secret, this should be a super long random string
     */
    secret: '',

    /**
     * See the documentation for your authentication strategy for what this array does
     */
    adminIdentifiers: ['admin@yourdomain.com']
};
