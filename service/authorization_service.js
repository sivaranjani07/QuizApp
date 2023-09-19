const commonHandleFunction = require('../common/common_handle_response')
const { errorMessage, responseMessage, fileName, methodName, operation, response_code, tokenValidity } = require('../config/app_config.json')
const cr = require('../common/common_response');
const authorizationRepo = require('../repo/authorization_repo')
const tokenService = require('../common/token');



async function  checkAuthorization(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            const { clientId, secretKey, email, userName, role } = req.body

            let checkedIdAndKey = await authorizationRepo.checkIdAndKeyRepo(clientId, secretKey)
            if (checkedIdAndKey) {
                let checkedUserNameAndEmail = await authorizationRepo.checkUserNameAndEmailRepo(email,role,clientId);
                let tokenDetails; let userDetailTokenObj;

                if (checkedUserNameAndEmail) {
                    userDetailTokenObj = { userId: checkedUserNameAndEmail.user_id, role: role, email: email, userName: userName, userStatus: checkedUserNameAndEmail.user_status, buId: checkedIdAndKey.bu_id }
                } else {
                    let addUser = await authorizationRepo.addUserRepo(email, userName, role, clientId);
                    userDetailTokenObj = { userId: addUser.user_id, role: role, email: email, userName: userName, userStatus: true, buId: checkedIdAndKey.bu_id }
                }

                tokenDetails = tokenService.createToken(userDetailTokenObj, tokenValidity.access, tokenValidity.refresh);
                tokenDetails.primaryDarkColor = checkedIdAndKey.primary_dark_color ? checkedIdAndKey.primary_dark_color : null;
                tokenDetails.primaryLightColor = checkedIdAndKey.primary_light_color ? checkedIdAndKey.primary_light_color : null;
                tokenDetails.secondaryLightColor = checkedIdAndKey.secondary_light_color ? checkedIdAndKey.secondary_light_color : null;
                tokenDetails.secondaryDarkColor = checkedIdAndKey.secondary_dark_color ? checkedIdAndKey.secondary_dark_color : null;

                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: tokenDetails })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.not_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }


        }), res: res, errorMessage: errorMessage, fileName: fileName.authorizationService, methodName: methodName.checkAuthorization, userId: ``, operation: operation.update
    })
}



async function addClientService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let addedClient = await authorizationRepo.addClientRepo(req.body)
            if (addedClient) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: addedClient })
                    ),
                });

            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: responseMessage.unhandled })
                    ),
                });
            }


        }), res: res, errorMessage: errorMessage, fileName: fileName.authorizationService, methodName: methodName.addClientService, userId: ``, operation: operation.post
    })
}







module.exports = { checkAuthorization, addClientService }