const { body, validationResult, query } = require('express-validator')
const { operation, subOperation, result, validation_error, fileName, methodName, validate, response_code } = require('../config/app_config.json')
const logger = require('../common/logger')
let sectionNameRegex = /^[a-zA-Z ]{1,15}$/

function sectionCreateValidation() {
    return [
        body(validate.sectionName).custom((val) => {
            if (!(sectionNameRegex.test(val))) {
                logger.warns({ file_name: fileName.sectionValidation, method_name: methodName.sectionCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.sectionName, errorcode: response_code.field_validation });

                throw new Error(validation_error.sectionName);
            }
            return true;
        }),
        body(validate.deckIdList).custom((val) => {
            if (val == undefined) {
                logger.warns({ file_name: fileName.sectionValidation, method_name: methodName.sectionCreateValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: validation_error.deckIdList, errorcode: response_code.field_validation });

                throw new Error(validation_error.deckIdList);
            }
            return true;
        }),
    ]
}

function updatesectionValidation() {
    return [
        body(validate.sectionName).custom((val) => {
            if (!(sectionNameRegex.test(val))) {
                logger.warns({ file_name: fileName.sectionValidation, method_name: methodName.sectionUpdateValidation, userid: ``, operation: operation.update, suboperation: subOperation.validation, result: result.fail, label: validation_error.sectionName, errorcode: response_code.field_validation });
                throw new Error(validation_error.sectionName);
            }
            return true;
        }),
    ]
}


function sectionSearchValidation() {
    return [
        query(validate.filterText).custom((val) => {
            if (!val || val == undefined) {
                logger.warns({ file_name: fileName.sectionValidation, method_name: methodName.sectionSearchValidation, userid: ``, operation: operation.post, suboperation: subOperation.validation, result: result.fail, label: `enter a value to search`, errorcode: response_code.field_validation });
                throw new Error(`enter a value to search`);
            }
            return true;
        })
    ]
}

module.exports = { sectionSearchValidation, sectionCreateValidation, updatesectionValidation }