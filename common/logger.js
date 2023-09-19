const { createLogger, transports, format, Logform } = require('winston')
const custom = format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), format.printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`
}))
const logger = createLogger({
    level: "silly",
    format: custom,
    transports: [
        new transports.File({ filename: 'log.log' }),
        new transports.Console()
    ]
});
function logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode) {
    return file_name + " : " + method_name + " : " + userid + " : " + operation + " : " + subOperation + " : " + result + " : " + label + " : " + errorcode
}
function infos({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.info(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
function errors({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.error(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
function warns({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.warn(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
function verboses({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.verbose(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
function debugs({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.debug(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
function sillys({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) {
    logger.silly(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
}
const operation = {
    create: "CREATE",
    read: "READ",
    update: "UPDATE",
    delete: "DELETE"
}
const subOperation = {
    entry: "ENTRY",
    validation: "VALIDATION",
    persists: "PERSISTS",
    exit: "EXIT"
}
const result = {
    success: "SUCCUSS",
    fail: "FAIL"
}
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};
function getCustomLogger(level, format, transports, options) {
    let customLogger = createLogger({
        level,
        format,
        transports,
        ...options
    });
    return ({
        infos: ({ file_name, method_name, userid, operation, subOperation, result, label, errorcode }) => {
            customLogger.info(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        },
        errors: (
            { file_name, method_name, userid, operation, subOperation, result, label, errorcode }
        ) => {
            customLogger.error(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        },
        warns: (
            { file_name, method_name, userid, operation, subOperation, result, label, errorcode }
        ) => {
            customLogger.warn(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        },
        verboses: (
            { file_name, method_name, userid, operation, subOperation, result, label, errorcode }
        ) => {
            customLogger.verbose(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        },
        debugs: (
            { file_name, method_name, userid, operation, subOperation, result, label, errorcode }
        ) => {
            customLogger.debug(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        },
        sillys: (
            { file_name, method_name, userid, operation, subOperation, result, label, errorcode }
        ) => {
            customLogger.silly(logFormat(file_name, method_name, userid, operation, subOperation, result, label, errorcode))
        }
    });
}
module.exports = { errors, getCustomLogger, warns, infos, verboses, levels, debugs, sillys, operation, subOperation, result, transports }