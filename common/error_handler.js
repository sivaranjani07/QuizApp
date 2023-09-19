const logger = require('./logger')
const config = require('../config/app_config.json')


function handleError({ error, fileName, methodName, userId, operation }) {
    if (error.message == "Connection terminated due to connection timeout") {
        logger.errors({ file_name: fileName, method_name: methodName, userid: userId ? userId : '', operation: operation, subOperation: config.subOperation.exit, result: config.result.fail, label: `Connection Timed Out`, errorcode: config.response_code.error_dbissue_serverissue });
        throw new Error(error.message)
    }
    else if ((error.message).includes('ECONNREFUSED','ENOTFOUND')) {
        logger.errors({ file_name: fileName, method_name: methodName, userid: userId ? userId : '', operation: operation, subOperation: config.subOperation.exit, result: config.result.fail, label: `Database Server Down`, errorcode: config.response_code.error_dbissue_serverissue });
        throw error
    } else {
        logger.errors({ file_name: fileName, method_name: methodName, userid: userId ? userId : '', operation: operation, subOperation: "exit", result: "fail", label: `${error.message}`, errorcode: config.response_code.error_dbissue_serverissue});
        throw error
    }
} module.exports = { handleError }