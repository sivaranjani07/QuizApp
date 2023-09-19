const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const appConfig = require('../config/app_config.json')
const moment = require('moment');
const handleError = require('../common/error_handler')
let Currentdate = moment().format('YYYY-MM-DD HH:mm:ss');

const addSectionRepo = async (body, token) => {
    const client = await pool.connect();
    try {
        let addsectionResponse
        await client.query('BEGIN');

        addsectionResponse = await client.query(dbQuery.sectionAddQuery, [
            token.buId,
            body.sectionName,
            token.userId,
            Currentdate,
            true
        ]);

        if (addsectionResponse?.rows[0]) {
            const sectionId = addsectionResponse.rows[0].section_id;
            const promises = body?.deckIdList?.map((deckId) => {
                if (deckId) {
                    return client.query(dbQuery.addSectiondeckref, [sectionId, deckId]);
                }
            });

            const results = await Promise.all(promises);
            const finalResult = results.map((result) => result.rows[0]);

            await client.query('COMMIT');
            return finalResult;
        }



        return addsectionResponse?.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.addSectionRepo, operation: appConfig.operation.post, userId: token.userId })

    } finally {
        client.release();
    }
};


const updateSectionRepo = async (body, token) => {

    try {
        let sectionUpdateResult = await pool.query(dbQuery.sectionUpdateQuery, [
            token.buId, body.sectionId, body.sectionName, Currentdate, token.userId]);
        return sectionUpdateResult.rows;

    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.updateSectionRepo, operation: appConfig.operation.update, userId: token.userId })
    }
}


const getAllSectionRepo = async (token) => {

    try {
        let sectionGetAllResult = await pool.query(dbQuery.sectionGetAllQuery, [
            token.buId
        ]);
        return sectionGetAllResult.rows;

    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getAllSectionRepo, operation: appConfig.operation.get, userId: token.userId })
    }
}

const getSectionByIdRepo = async (sectionId, token) => {

    try {
        let sectionGetResult = await pool.query(dbQuery.sectionGetByIdQuery, [
            sectionId, token.buId
        ]);
        return sectionGetResult.rows;

    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getSectionByIdRepo, operation: appConfig.operation.get, userId: token.userId })
    }

}


const deleteSectionByIdRepo = async (sectionId, token) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(dbQuery.sectionDeckRefDeleteBySectionIdQuery, [sectionId]);
        const deleteSectionResult = await client.query(dbQuery.sectionDeleteByIdQuery, [sectionId, token.buId]);
        await client.query('COMMIT');
        return deleteSectionResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.deleteSectionByIdRepo, operation: appConfig.operation.delete, userId: token.userId })
    } finally {
        client.release();
    }
};


const deleteSectionDeckRepo = async (params, token) => {
    const { deckId, sectionId } = params;
    try {
        const deleteSectionDeckRefResponse = await pool.query(dbQuery.removeSectiondeckref, [sectionId, deckId]);
        return deleteSectionDeckRefResponse.rows[0]
    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.deleteSectionDeckRepo, operation: appConfig.operation.delete, userId: token.userId })
    }
};

const getUserSectionRepo = async (token) => {
    try {
        let sectionGetUserResult = await pool.query(dbQuery.getSectionDeckQuery, [
            token.buId
        ]);
        return sectionGetUserResult.rows[0].count;

    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getUserSectionRepo, operation: appConfig.operation.get, userId: token.userId })
    }
}

const addSectionDecksRepo = async (body, token) => {
    const { deckIdList, sectionId } = body;
    try {
        const deckListresponse = deckIdList.map(async (deckId) => {
            await pool.query(dbQuery.addSectiondeckref, [sectionId, deckId]);
        });
        const addSectionresult = await Promise.all(deckListresponse);
        return addSectionresult;
    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.addSectionDecksRepo, operation: appConfig.operation.post, userId: token.userId })
    }
};

const getDeckBySectionRepo = async (sectionId, filterText, token) => {
    try {
        const filterTex = filterText + '%';
        const searchResults = await pool.query(dbQuery.sectionDeckSearchQuery, [sectionId, filterTex]);
        return searchResults.rows;
    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getDeckBySectionRepo, operation: appConfig.operation.get, userId: token.userId })
    }
}

const getSectionDeckBySectionRepo = async (sectionId, filterText, token) => {
    try {
        const filterTex = filterText + '%';
        const searchResults = await pool.query(dbQuery.getSectionDeckSearchQuery, [sectionId, filterTex]);
        return searchResults?.rows;
    } catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getDeckBySectionRepo, operation: appConfig.operation.get, userId: token.userId })
    }
}

const getSectionsRepo = async (token) => {
    try {
        const getSectionData = await pool.query(dbQuery.getSections, [token.buId]);
        if (getSectionData?.rows?.length > 0) {
            return getSectionData.rows;
        } else {
            return false;
        }
    }
    catch (error) {
        handleError.handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getSectionsRepo, operation: appConfig.operation.get, userId: token.userId })
    }
}

const getSectionsDeckRepo = async (sectionId) => {
    try {
        const getSectionDeckData = await pool.query(dbQuery.getSectionDecks, [sectionId]);
        if (getSectionDeckData?.rows.length > 0) {
            return getSectionDeckData.rows;
        } else {
            return false;
        }
    }
    catch (error) {
        handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getSectionsDeckRepo, operation: appConfig.operation.get, userId: `` })
    }
}


const toggleSectionRepo = async (body) => {
    try {
        const getSectionDeckData = await pool.query(dbQuery.toggleSection, [body.visibility, body.sectionId]);
     return  getSectionDeckData?.rows.length > 0 
       
    }
    catch (error) {
        handleError({ error: error, fileName: appConfig.fileName.sectionRepo, methodName: appConfig.methodName.getSectionsDeckRepo, operation: appConfig.operation.get, userId: `` })
    }
}

module.exports = { getSectionDeckBySectionRepo, toggleSectionRepo, getSectionsDeckRepo, getSectionsRepo, addSectionRepo, updateSectionRepo, getAllSectionRepo, getSectionByIdRepo, deleteSectionByIdRepo, deleteSectionDeckRepo, getUserSectionRepo, addSectionDecksRepo, getDeckBySectionRepo }

