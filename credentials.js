module.exports = {
    mongo: {
        development: {
            connectionString: 'changeme'
        },
        production: {
            connectionString: 'changeme'
        }
    },
    session: {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // This needs to be true if in prod under https
    }
}
