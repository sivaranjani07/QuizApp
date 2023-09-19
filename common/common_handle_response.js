
const config = require("../config/app_config.json");
const common_respone = require("../common/common_response");
const logger = require('./logger')
const handleCommonResponse = async ({ successCb, res, errorMessage, fileName, methodName, userId, operation }) => {
    try {
        // logger.infos({ file_name: fileName, method_name: methodName, userid: userId ? userId : ``, operation: operation, subOperation: logger.subOperation.exit, result: logger.result.success, label: ``, errorcode: config.response_code.success })
        return await successCb(({ data }) =>
            res.set("Connection", "close").status(200).json(data)
        );
    }
    catch (error) {
        logger.errors({ file_name: fileName, method_name: methodName, userid: userId ? userId : ``, operation: operation, subOperation: logger.subOperation.exit, result: logger.result.fail, label: `${error.message}`, errorcode: config.response_code.error_dbissue_serverissue })
        let code = config.errors[error.message] || config.errors[error.code];
        let value
        if (errorMessage) {
            if (code && code == config.response_code.duplication) {
                value = `${errorMessage.duplication} ${JSON.parse(error.message.split(" ").slice(-1)[0])}`;
            } else if (code && code == config.response_code.timeOut) {
                value = errorMessage.timeOut;
            } else {
                code = config.response_code.error_dbissue_serverissue;
                value = errorMessage.unhandled;
            }
        } else {
            code = code || config.response_code.error_dbissue_serverissue;
        }

        return res
            .set("Connection", "close")
            .status(200)
            .send(
                common_respone.responseCb(
                    common_respone.headerCb({ code: code }),
                    common_respone.bodyCb({
                        val: value
                    })
                )
            );
    }
};

const fieldValidationResponse = (res, errors) => {
    let errorList= []
    errors.array().map(a => {
        delete a.type
        delete a.value
        delete a.location
        errorList.push(a)
    })
   
   
    res
        .set("Connection", "close")
        .status(200)
        .send({
            header: {
                code: config.response_code.field_validation,
            },
            error:errorList,
        });
};


module.exports = {
    handleCommonResponse,
    fieldValidationResponse,
};