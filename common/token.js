let jwt = require('jsonwebtoken')
let config = require("../config/app_config.json")
const authorization = require('../config/authorization.json');
const responseBody = require('../common/common_response')

function createToken(userDetail, accessExp, refreshExp) {

    try {
        let accessToken = jwt.sign({ userDetail }, config.token_detials.access_key, { expiresIn: accessExp });
        let refreshToken = jwt.sign({ userDetail }, config.token_detials.refresh_key, { expiresIn: refreshExp });
        // console.log({ "accessToken": accessToken , "refreshToken": refreshToken });
        return { "accessToken": accessToken, "refreshToken": refreshToken };
    } catch (error) {
        return error;
    }
}


function verifyToken(req, res, next) {
    let mobileToken = req.headers["authorization"];
    let token;
    if (!mobileToken) {
        return res.set("Connection", "close").status(401).json()
    } else {
        let accessToken = mobileToken.split(" ")[1];
        token = accessToken;
    }
    jwt.verify(token, config.token_detials.access_key, function (err) {
        if (!err) {
            req.token = decode(token);
            next();
        }
        else {
            return res.set("Connection", "close").status(401).json()
        }
    })
}

function verifyRole(req, res, next) {
    // console.log(req);
    let routeURL;
    const queryURL = req.url?.split('?')[0]
    if (queryURL) {
        routeURL = queryURL.split('/')
    } else {
        routeURL = req.url.split('/');
    }
    // console.log(routeURL, "routeURL");
    const url = `${routeURL[1]}/${routeURL[2]}`;
    // console.log(url,"url");


    const role = req.token?.role;
    // console.log(role, url, authorization?.[role]?.includes(url));
    if (role && authorization?.[role]?.includes(url)) {
        next();
    } else {
        res.status(200).send(
            responseBody.responseCb(
                responseBody.headerCb({ code: config.response_code.unauthorize }),
                responseBody.bodyCb({ val: "Unauthorized access" })
            )
        )
    }
}

function newAccessToken(req, res, accessExp, refreshExp, callback) {
    let refToken = req.body?.refreshToken
    // console.log(refToken, "refToken");
    let token;
    if (!refToken) {
        return res.set("Connection", "close").status(401).json()
    } else {
        token = refToken
    }
    let userDetail = decode(token)
    jwt.verify(token, config.token_detials.refresh_key, (err) => {
        if (!err) {
            const accessToken = jwt.sign({ userDetail }, config.token_detials.access_key, { expiresIn: accessExp });
            const refreshToken = jwt.sign({ userDetail }, config.token_detials.refresh_key, { expiresIn: refreshExp })
            return res
                .set("Connection", "close")
                .status(200)
                .json({
                    token: {
                        "accessToken": accessToken,
                        "refreshToken": refreshToken
                    }
                })
        } else {
            if (callback) {
                return callback(() => res.set("Connection", "close").status(417).clearCookie("accessToken").clearCookie("refreshToken").json())
            } else {
                return res.set("Connection", "close").status(417).clearCookie("accessToken").clearCookie("refreshToken").json()
            }

        }
    })
}

function decode(token) {
    return jwt.decode(token)?.userDetail;
}

module.exports = { createToken, verifyToken, newAccessToken, decode, verifyRole }
