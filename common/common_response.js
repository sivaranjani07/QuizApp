const responseCb = (header, body) => {

    return !body ? {
        "header": header,
    } : {
        "header": header,
        "body": body,
    }
}

const headerCb = ({ code }) => {
    return {
        "code": code,
    }
}

const bodyCb = ({ val, err }) => {
    return {
        "value": !val ? null : val,
        "error": !err ? null : err
    }
}


module.exports = {
    headerCb,
    bodyCb,
    responseCb
}