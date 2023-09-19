const cr = require('../common/common_response');
const config_app = require('../config/app_config.json')


function successResponse({ successCb, data }) {
    if (data) {
        if (data?.length == 0) {
            successCb({
                data: cr.responseCb(
                    cr.headerCb({ code: config_app.response_code.no_data_found }),
                    cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                ),
            });
        } else {
            successCb({
                data: cr.responseCb(
                    cr.headerCb({ code: config_app.response_code.success })
                    , cr.bodyCb({ val: data })
                ),
            });
        }
    }
    
    else {
        successCb({
            data: cr.responseCb(
                cr.headerCb({ code: config_app.response_code.success })
            ),
        });
    }
}
module.exports = { successResponse }