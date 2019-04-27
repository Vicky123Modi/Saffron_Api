'use strict';
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================

module.exports = {
    // MongoDB connection options
    mongo: {
        //uri: 'mongodb://lanetteam.vicky:VICKYv78@ds135669.mlab.com:35669/online_database'
        uri: 'mongodb://127.0.0.1:27017/saffron'
    },
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            storage: 'test.sqlite',
            define: {
                timestamps: false
            }
        }
    },
    port: '9000'
};
//# sourceMappingURL=test.js.map
