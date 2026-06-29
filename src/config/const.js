module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URL: process.env.MONGO_URL || "mongodb://localhost/",
    DB_NAME: process.env.DB_NAME || "my_database",
    FRONTEND_PROEJCT_NAME: 'frontend'
}