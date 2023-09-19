const { body, validationResult, query } = require('express-validator')
const { operation, subOperation, result, validation_error, fileName, methodName, validate, response_code } = require('../config/app_config.json')
const logger = require('../common/logger')

function cardCreateValidation() {
    return [
        body(validate.question).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.question, errorcode: response_code.field_validation });

                throw new Error(validation_error.question);
            }
            return true;
        }),
        body(validate.questionType).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.questionType, errorcode: response_code.field_validation });

                throw new Error(validation_error.questionType);
            }
            return true;
        }),
    ]
}

function cardUpdateValidation() {
    return [
        body(validate.question).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardUpdateValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.question, errorcode: response_code.field_validation });

                throw new Error(validation_error.question);
            }
            return true;
        })
    ]
}

function cardVisibilityUpdateValidation() {
    return [
        body(validate.deckId).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardVisibilityUpdateValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.deckId, errorcode: response_code.field_validation });

                throw new Error(validation_error.deckId);
            }
            return true;
        }),
        body(validate.cardId).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardVisibilityUpdateValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.cardId, errorcode: response_code.field_validation });

                throw new Error(validation_error.cardId);
            }
            return true;
        }),
        body(validate.visibility).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.cardUpdateValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.visibility, errorcode: response_code.field_validation });

                throw new Error(validation_error.visibility);
            }
            return true;
        })
    ]
}

function deleteImageValidation() {
    return [
        query(validate.cardId).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.deleteImageValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.cardId, errorcode: response_code.field_validation });
                throw new Error(validation_error.cardId);
            }
            return true;
        }),
        query(validate.type).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.deleteImageValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.type, errorcode: response_code.field_validation });

                throw new Error(validation_error.type);
            }
            return true;
        }),
        query(validate.imageId).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.cardValidation, method_name: methodName.deleteImageValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.imageId, errorcode: response_code.field_validation });

                throw new Error(validation_error.imageId);
            }
            return true;
        }),
    ]
}


module.exports = { cardCreateValidation, cardUpdateValidation, cardVisibilityUpdateValidation, deleteImageValidation }