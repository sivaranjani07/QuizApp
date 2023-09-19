const { body, query, validationResult } = require('express-validator')
const { operation, subOperation, result, validation_error, fileName, methodName, validate, response_code } = require('../config/app_config.json')
const logger = require('../common/logger')

function deckCreateValidation() {
    return [
        body(validate.deckName).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.deckName, errorcode: response_code.field_validation });
                throw new Error(validation_error.deckName);
            }
            return true;
        }),
        body(validate.difficultyLevel).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.difficultyLevel, errorcode: response_code.field_validation });

                throw new Error(validation_error.difficultyLevel);
            }
            return true;
        }),
        body(validate.subject).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.subject, errorcode: response_code.field_validation });
                throw new Error(validation_error.subject);
            }
            return true;
        }),
        body(validate.file).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.file, errorcode: response_code.field_validation });
                throw new Error(validation_error.file);
            }
            return true;
        }),
    ]
}



function deckUpdateteValidation() {
    return [
        body(validate.deckName).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.deckName, errorcode: response_code.field_validation });

                throw new Error(validation_error.deckName);
            }
            return true;
        }),
        body(validate.difficultyLevel).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.difficultyLevel, errorcode: response_code.field_validation });

                throw new Error(validation_error.difficultyLevel);
            }
            return true;
        }),
        body(validate.subject).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.subject, errorcode: response_code.field_validation });
                throw new Error(validation_error.subject);
            }
            return true;
        }),
        body(validate.topic).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.subject, errorcode: response_code.field_validation });
                throw new Error(validation_error.topic);
            }
            return true;
        })
    ]
}


function deckSearchValidation() {
    return [
        query(validate.deckName).custom((val) => {
            if (!val || val == undefined) {
                logger.warns({ file_name: fileName.deckValidation, method_name: methodName.deckCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: `enter a value to search`, errorcode: response_code.field_validation });
                throw new Error(`enter a value to search`);
            }
            return true;
        })
    ]
}



module.exports = { deckCreateValidation, deckUpdateteValidation, deckSearchValidation }