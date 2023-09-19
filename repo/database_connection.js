let dbConfig = require('../config/app_config.json');
const { Pool } = require("pg");
const dotenv = require('dotenv').config()




const pool = new Pool({
  user: process.env.DB_POSTGRES_USER ?? dbConfig.db_postgres.user,
  host: process.env.DB_POSTGRES_HOST ?? dbConfig.db_postgres.host,
  database: process.env.DB_POSTGRES_DATABASE ?? dbConfig.db_postgres.database,
  password: process.env.DB_POSTGRES_PASSWORD ?? dbConfig.db_postgres.password,
  port: process.env.DB_POSTGRES_PORT ?? dbConfig.db_postgres.port
});

pool.on("error", (err, client) => {
//   logger.infos({ file_name: localconfig.fileName.dbConnection, method_name: localconfig.methodName.Pool, userid: "", operation: logger.operation.read, subOperation: logger.subOperation.exit, result: logger.result.success, label: ``, errorcode: config.response_code.error_dbissue_serverissue })
})

module.exports = pool;

