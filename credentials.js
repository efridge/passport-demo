module.exports = {
    mongo: {
        development: {
            connectionString: 'mongodb://localhost:27017/passport-demo?retryWrites=true&w=majority'
        },
        production: {
            connectionString: 'mongodb://localhost:27017/passport-demo?retryWrites=true&w=majority'
        }
    },
    session: {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // This needs to be true if in prod under https
    }
}
