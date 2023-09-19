const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const logger = require('../common/logger')
const { response_code } = require('../config/app_config.json');
const config = require('../config/app_config.json')
const handleError = require('../common/error_handler')






const addUserResultRepo = async (body, userId, clientId) => {
    try {
        const dbUserData = await pool.query(dbQuery.addUserResult, [
            body.deckId,
            body.score,
            body.correctAnswer,
            body.usingHint,
            body.withoutUsingHint,
            body.incorrectAnswer,
            body.unAnswered,
            new Date(),
            userId,
            clientId
        ]);
        if (dbUserData?.rows) {
            return dbUserData.rows[0];
        }
        else {
            return false;
        }
    } catch (error) {
        handleError.handleError({ error: error, fileName: config.fileName.userRepo, methodName: config.methodName.addUserResultRepo, operation: logger.operation.create, userId: userId })

    }
}



const getUserResultRepo = async (userId, clientId, deckId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN')
        const dbUserData = await client.query(dbQuery.getUserResult, [clientId, deckId]);

        if (dbUserData?.rows.length > 0) {
            let data = await client.query(dbQuery.getResult, [userId, clientId, deckId]);
            if (data?.rows[0]?.score) {
                dbUserData.rows[0].score = data?.rows[0].score + "/" + (JSON.parse(dbUserData.rows[0].cardCount) * 2)
            } else {
                dbUserData.rows[0].score = 0 + "/" + (JSON.parse(dbUserData.rows[0].cardCount) * 2)
            }
            await client.query('COMMIT')
            return dbUserData.rows[0];
        }
        else {
            await client.query('COMMIT')

            return false;
        }

    } catch (error) {
        await client.query('ROLLBACK')
        handleError.handleError({ error: error, fileName: config.fileName.userRepo, methodName: config.methodName.getUserResultRepo, operation: logger.operation.get, userId: userId })

    } finally {
        client.release();
    }
}


const getFavoriteAndReviseRepo = async (userId, buId, type) => {
    try {
        let dbUserData;
        if (type == config.type) {
            dbUserData = await pool.query(dbQuery.getFavoriteCards, [userId, buId]);
        } else {
            dbUserData = await pool.query(dbQuery.getReviseCards, [userId, buId]);
        }
        if (dbUserData?.rows.length > 0) {
            return dbUserData.rows;
        }
        else {
            return false;
        }
    } catch (error) {
        handleError.handleError({ error: error, fileName: config.fileName.userRepo, methodName: config.methodName.getFavoriteAndReviseRepo, operation: logger.operation.get, userId: userId })

    }
}








module.exports = {
    addUserResultRepo, getUserResultRepo, getFavoriteAndReviseRepo

}