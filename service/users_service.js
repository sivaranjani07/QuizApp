const commonHandleFunction = require('../common/common_handle_response')
const responseBody = require('../common/common_response')
const { errorMessage, responseMessage, response_code, fileName, methodName, operation } = require('../config/app_config.json')
const userRepo = require('../repo/users_repo')
const deckService = require('./deck_service')

function addUserResult(req, res,) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let { userId, buId } = req.token;
            let addedUserResult = await userRepo.addUserResultRepo(req.body, userId, buId);
            if (addedUserResult) {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.success }),
                        responseBody.bodyCb({ val: responseMessage.resultAdded })
                    ),
                })
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.error_dbissue_serverissue }),
                        responseBody.bodyCb({ val: responseMessage.unhandled })
                    ),
                })
            }

        }, res: res, errorMessage: errorMessage, fileName: fileName.userRepo, methodName: methodName.addUserResult, userId: req.token.buId, operation: operation.post
    })
}

function getUserResult(req, res,) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let { userId, buId } = req.token;
            let getUserResult = req.params?.deckId ? await userRepo.getUserResultRepo(userId, buId, req.params.deckId) : false;
            if (getUserResult) {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.success }),
                        responseBody.bodyCb({ val: getUserResult })
                    ),
                })
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.no_data_found }),
                        responseBody.bodyCb({ val: responseMessage.noDataFound })
                    ),
                })
            }

        }, res: res, errorMessage: errorMessage, fileName: fileName.userRepo, methodName: methodName.getUserResult, userId: req.token.buId, operation: operation.get
    })
}

function getFavoriteAndReviseResult(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let finalData = [];
            let { userId, buId } = req.token;
            let getUserResult = req.params?.type ? await userRepo.getFavoriteAndReviseRepo(userId, buId, req.params.type) : false;
            if (getUserResult) {
                getUserResult.map(data => {
                    let userResult = deckService.optionsList(data);
                    const { option1, option2, option3, option4, option5, option1Image, option2Image, option3Image, option4Image, option5Image, ...newData } = data;
                    newData.options = userResult;
                    finalData.push(newData);
                })
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.success }),
                        responseBody.bodyCb({ val: finalData })
                    ),
                })
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.no_data_found }),
                        responseBody.bodyCb({ val: responseMessage.noDataFound })
                    ),
                })
            }

        }, res: res, errorMessage: errorMessage, fileName: fileName.userRepo, methodName: methodName.getFavoriteAndReviseResult, userId: req.token.buId, operation: operation.get
    })
}


module.exports = {
    addUserResult, getUserResult, getFavoriteAndReviseResult
}















