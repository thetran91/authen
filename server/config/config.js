const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE:process.env.MONGODB_URI,
        PORT: process.env.PORT
    },
    default: {
        SECRET: 'THETRAN',
        DATABASE:'mongodb://localhost:27017/auth',
        PORT: 3000
    }
}
exports.get = function get(env){
    return config[env] || config.default;

}