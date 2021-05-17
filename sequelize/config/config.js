require('dotenv').config();

config = {
  [process.env.NODE_ENV] : {
    dialect: process.env.DB_DIARECT,
    database: process.env.DB_NAME,
    storage: process.env.DB_STORAGE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
}

console.log(config);
module.exports = config;
