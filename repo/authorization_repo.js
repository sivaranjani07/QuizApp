const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const config = require('../config/app_config.json')
const { handleError } = require('../common/error_handler')
const { v4: uuidv4 } = require('uuid');


const addUserRepo = async (email, userName, role, clientId) => {
    try {
        let response = await pool.query(dbQuery.addUser, [userName, email, role, clientId, true, new Date()]);
        if (response?.rows?.length > 0) {
            return response.rows[0];
        } else {
            return false;
        }
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.authorizationRepo, methodName: config.methodName.addUserRepo, operation: config.operation.post, userId: userName })
    }
}


const checkIdAndKeyRepo = async (id, key) => {
    try {
        let response = await pool.query(dbQuery.checkIdAndKey, [id, key]);
        if (response?.rows?.length > 0) {
            return response?.rows[0];
        } else {
            return false;
        }
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.authorizationRepo, methodName: config.methodName.checkIdAndKeyRepo, operation: config.operation.get, userId: id })

    }
}

const checkUserNameAndEmailRepo = async (email, role, clientId) => {
    try {
        let response = await pool.query(dbQuery.checkUserAndEmail, [email, role, clientId]);
        if (response?.rows?.length > 0) {
            return response.rows[0];
        } else {
            return false;
        }
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.authorizationRepo, methodName: config.methodName.checkUserNameAndEmailRepo, operation: config.operation.get, userId: '' })
    }
}

const generateSecretKey = (size) => {
    const numBytes = Math.ceil(size / 2);
    const randomBytes = uuidv4(null, Buffer.alloc(numBytes));
    return randomBytes.toString('hex').slice(0, size);
};


const addClientRepo = async (body) => {
    try {
        const secretKey = generateSecretKey(32);

        let response = await pool.query(dbQuery.addClient, [secretKey, body.displayName, body.primaryDarkColor, body.primaryLightColor, body.secondaryLightColor, body.secondaryDarkColor, body.name, new Date(), true]);
        if (response?.rows?.length > 0) {
            return { buId: response.rows[0].bu_id, secretKey: secretKey };
        } else {
            return false;
        }
    }
    catch (error) {
        // await addClientRepo(body);
        handleError({ error: error, fileName: config.fileName.authorizationRepo, methodName: config.methodName.addClientRepo, operation: config.operation.get, userId: body?.name ?? null })
    }
}

module.exports = { addClientRepo, addUserRepo, checkIdAndKeyRepo, checkUserNameAndEmailRepo }