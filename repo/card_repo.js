const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const config = require('../config/app_config.json')
const moment = require('moment');
const { fileUpload, deleteFile } = require('../common/fileupload');
let Currentdate = moment().format('YYYY-MM-DD HH:mm:ss');

const { handleError } = require('../common/error_handler');


const getByIdCardRepo = async (cardId, buId) => {

    try {
        let getCardResponse = await pool.query(dbQuery.cardGetByIdQuery, [buId, cardId]);
        return getCardResponse.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.getByIdCardRepo, operation: config.operation.get, userId: buId })
    }
}

const addCardRepo = async (cardData, userData) => {
    let client = await pool.connect();
    try {

        await client.query('BEGIN');
        for (let data in cardData) {
            let imageAddResponse;
            if (data == config.fieldName.questionImages && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
            if (data == config.fieldName.hintImages && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
            if (data == config.fieldName.option1Images && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
            if (data == config.fieldName.option2Images && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }

            if (data == config.fieldName.option3Images && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
            if (data == config.fieldName.option4Images && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
            if (data == config.fieldName.option5Images && cardData[data]) {
                imageAddResponse = await client.query(dbQuery.ImageAddQuery, [cardData[data]])
                if (imageAddResponse?.rows?.length > 0) {
                    cardData[data] = imageAddResponse.rows[0].image_id;
                    imageAddResponse = null;
                }
            }
        }


        let addcardResponse = await client.query(dbQuery.cardAddQuery, [
            userData.buId,
            cardData.question,
            cardData.questionImage ? cardData.questionImage : null,
            cardData.solution,
            cardData.option1,
            cardData.option2,
            cardData.option3,
            cardData.option4,
            cardData.option5,
            cardData.option1Image ? cardData.option1Image : null,
            cardData.option2Image ? cardData.option2Image : null,
            cardData.option3Image ? cardData.option3Image : null,
            cardData.option4Image ? cardData.option4Image : null,
            cardData.option5Image ? cardData.option5Image : null,
            cardData.hintText,
            cardData.hintImage ? cardData.hintImage : null,
            true,
            Currentdate,
            userData.userId,
            cardData.deckId,
            cardData.questionType,
        ]);
        if (addcardResponse?.rows?.length > 0) {
            let updateCardCountResult = await client.query(dbQuery.cardCountUpdateQuery, [cardData.deckId, 1]);
            await client.query('COMMIT')
            return updateCardCountResult.rowCount;
        }


    } catch (error) {
        await client.query('ROLLBACK')
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.addCardRepo, operation: config.operation.post, userId: userData?.buId })
    }
    finally {
        client.release();
    }

}

const updatecardRepo = async (body, token) => {
    try {
        let updateCardResponse = await pool.query(dbQuery.cardUpdateByIdQuery, [
            body.question,
            body.solution,
            body.option1 ?? "",
            body.option2 ?? "",
            body.option3 ?? "",
            body.option4 ?? "",
            body.option5 ?? "",
            body.hint,
            Currentdate,
            token.updatedBy,
            body.cardId,
            body.deckId,
            token.buId,
            body.option1Image ?? null,
            body.option2Image ?? null,
            body.option3Image ?? null,
            body.option4Image ?? null,
            body.option5Image ?? null,
        ]);

        return updateCardResponse?.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.updatecardRepo, operation: config.operation.update, userId: token.buId })
    }


}

const getCardDataByDeckId = async (deckId) => {
    let client = await pool.connect();
    try {
        let getCardResponse = await client.query(dbQuery.cardGetByDeckIdQuery, [deckId]);
        return getCardResponse.rows
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.getCardDataByDeckId, operation: config.operation.get, userId: `` })
    }
}

const updateEmptyImageCardRepo = async (columnName, cardId, buId, userId) => {

    try {
        let query = `update card set ${columnName}=null,updated_at=$3,updated_by=$4 where card_id=$1 and bu_id=$2`
        let imageUpdatResult = await pool.query(query, [cardId, buId, moment().format('YYYY-MM-DD HH:mm:ss'), userId]);
        return imageUpdatResult.rowCount;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.updateEmptyImageCardRepo, operation: config.operation.update, userId: buId })
    }

}


const deleteByIdCardRepo = async (cardId, deckId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        let getRevisiondeck = await client.query(dbQuery.getReviseDataByCardIdQuery, [cardId]);

        if (getRevisiondeck.rowCount > 0) {
            let revisionResult = await client.query(dbQuery.revisionDataDeleteByCardQuery, [cardId])
            if (revisionResult.rowCount > 0) {
                let cardDeleteResponse = await client.query(dbQuery.cardDeleteByIdQuery, [cardId]);
                if (cardDeleteResponse.rowCount > 0) {
                    let cardCount = await client.query(dbQuery.cardCountGetByDeckIdQuery, [deckId]);
                    let updatedCount = cardCount.rows[0].card_count - 1;
                    let deleteCardCount = await client.query(dbQuery.cardCountUpdateQuery, [deckId, updatedCount])
                    if (deleteCardCount.rowCount > 0) {
                        await client.query('COMMIT')
                        return cardDeleteResponse.rowCount
                    }
                }
            }

        }
    }
    catch (error) {
        await client.query('ROLLBACk')
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteByIdCardRepo, operation: config.operation.delete, userId: `` })

    }
    finally {
        client.release()
    }

}

const updateCardVisibilityRepo = async (body, token) => {
    try {
        let updateResult = await pool.query(dbQuery.cardVisibilityUpdateQuery, [
            token.buId, body.deckId, body.cardId, body.visibility, token.userId, Currentdate]);
        return updateResult?.rows[0];
    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.updateCardVisibilityRepo, operation: config.operation.update, userId: token.userId })
    }
}



const deleteImageCardRepo = async (imageId) => {
    try {
        let getImageResult = await pool.query(dbQuery.getImageQuery, [imageId]);


        if (getImageResult?.rows?.length > 0) {
            let deleteImageResult = await pool.query(dbQuery.deleteImageUrlQuery, [imageId]);


            if (deleteImageResult?.rowCount) {
                return getImageResult.rows[0];
            }
        }
    } catch (error) {
        // handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteImageCardRepo, operation: config.operation.delete, userId: `` })
        return 0;
    }
}



const updateCardImageRepo = async (image, cardId, columnName, token, imageId) => {

    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        let updateCardImageResult;
        //delete call for card
        if (imageId) {
            let query = `update card set ${columnName}=null,updated_at=$3,updated_by=$4 where card_id=$1 and bu_id=$2`
            let imageUpdatResult = await pool.query(query, [cardId, token.buId, moment().format('YYYY-MM-DD HH:mm:ss'), token.userId]);
            //if update then go and delete from
            if (imageUpdatResult.rowCount > 0) {
                let getImageResult = await pool.query(dbQuery.getImageQuery, [imageId]);
                if (getImageResult?.rows?.length > 0) {
                    let deleteImageResult = await pool.query(dbQuery.deleteImageUrlQuery, [imageId]);
                    if (deleteImageResult?.rowCount) {
                        if (getImageResult.rows[0].image_url) {
                            let deleteImageCardBucketResult = await deleteFile(getImageResult.rows[0].image_url, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName);
                            if (deleteImageCardBucketResult.header.code == 600) {
                                let addImageResult = await client.query(dbQuery.ImageAddQuery, [image]);
                                if (addImageResult?.rows?.length > 0) {
                                    let query = `update card set ${columnName}=$1,updated_at = $4,updated_by = $5 where card_id=$2 and bu_id=$3`
                                    updateCardImageResult = await client.query(query, [addImageResult.rows[0].image_id, cardId, token.buId, Currentdate, token.userId]);
                                    await client.query('COMMIT');
                                    return updateCardImageResult?.rowCount;
                                }
                                else {
                                    let addImageResult = await client.query(dbQuery.ImageAddQuery, [image]);
                                    if (addImageResult?.rows?.length > 0) {
                                        let query = `update card set ${columnName}=$1,updated_at = $4,updated_by = $5 where card_id=$2 and bu_id=$3`
                                        updateCardImageResult = await client.query(query, [addImageResult.rows[0].image_id, cardId, token.buId, Currentdate, token.userId]);
                                        await client.query('COMMIT');
                                        return updateCardImageResult?.rowCount;
                                    }

                                }
                            }
                        }
                    }
                }
                else {
                    await client.query('COMMIT');
                    return getImageResult?.rowCount;
                }
            }
        }

        else {

            let addImageResult = await client.query(dbQuery.ImageAddQuery, [image]);
            if (addImageResult?.rows?.length > 0) {
                let query = `update card set ${columnName}=$1,updated_at = $4,updated_by = $5 where card_id=$2 and bu_id=$3`
                updateCardImageResult = await client.query(query, [addImageResult.rows[0].image_id, cardId, token.buId, Currentdate, token.userId]);
                await client.query('COMMIT');
                return updateCardImageResult?.rowCount;
            }

        }
    }
    catch (error) {
        await client.query('ROLLBACk')
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.updateCardImageRepo, operation: config.operation.update, userId: token.userId })
    }
    finally {
        client.release()
    }

}


const finalCardCheckRepo = async (cardId) => {

    try {
        let finalCardCheckResult = await pool.query(dbQuery.finalCardCheckQuery, [cardId]);
        return finalCardCheckResult.rowCount;
    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.finalCardCheckRepo, operation: config.operation.get, userId: `` })

    }
}

const getCardByIdListRepo = async (deckId, buId, userId) => {
    try {
        let cardResponseList = await pool.query(dbQuery.getCardByIdListQuery, [deckId, buId, userId]);
        return cardResponseList.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.getCardByIdListRepo, operation: config.operation.get, userId: userId })

    }
}


const getCardByIdRepo = async (deckId) => {

    try {
        let getCardByIdRepoResult = await pool.query(dbQuery.getCardByIdQuery, [deckId]);
        return getCardByIdRepoResult.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.getByIdCardRepo, operation: config.operation.get, userId: `` })

    }
}

const deleteCardRepo = async (cardId, deckId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        let getCardDataResult = await client.query(dbQuery.cardGetAllQuery, [cardId]);
        if (getCardDataResult?.rows.length > 0) {
            let {
                card_id,
                question_image,
                hint_image,
                option1_image,
                option2_image,
                option3_image,
                option4_image,
                option5_image
            } = getCardDataResult.rows[0];

            let imagecount = await client.query(`select count(case when question_image=${question_image} or hint_image=${question_image} or option1_image=${question_image} or option2_image=${question_image} or option3_image=${question_image} or option4_image=${question_image} or option5_image=${question_image} then card_id end) as question_image_count,count(case when question_image=${hint_image} or hint_image=${hint_image} or option1_image=${hint_image} or option2_image=${hint_image} or option3_image=${hint_image} or option4_image=${hint_image} or option5_image=${hint_image} then card_id end) as hint_image_count,count(case when question_image=${option1_image} or hint_image=${option1_image} or option1_image=${option1_image} or option2_image=${option1_image} or option3_image=${option1_image} or option4_image=${option1_image} or option5_image=${option1_image} then card_id end) as option1_image_count,count(case when question_image=${option2_image} or hint_image=${option2_image} or option1_image=${option2_image} or option2_image=${option2_image} or option3_image=${option2_image} or option4_image=${option2_image} or option5_image=${option2_image} then card_id end) as option2_image_count,count(case when question_image=${option3_image} or hint_image=${option3_image} or option1_image=${option3_image} or option2_image=${option3_image} or option3_image=${option3_image} or option4_image=${option3_image} or option5_image=${option3_image} then card_id end) as option3_image_count,count(case when question_image=${option4_image} or hint_image=${option4_image} or option1_image=${option4_image} or option2_image=${option4_image} or option3_image=${option4_image} or option4_image=${option4_image} or option5_image=${option4_image} then card_id end)as option4_image_count,count(case when question_image=${option5_image} or hint_image=${option5_image} or option1_image=${option5_image} or option2_image=${option5_image} or option3_image=${option5_image} or option4_image=${option5_image} or option5_image=${option5_image} then card_id end) as option5_image_count from card`)

            let deleteImageList = [];
            let deleteImageFlag = false;
            if ((Number(imagecount.rows[0].question_image_count) <= 1) && question_image) {
                deleteImageList.push(question_image);
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].hint_image_count) <= 1) && hint_image) {
                deleteImageList.push(hint_image)
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].option1_image_count) <= 1) && option1_image) {
                deleteImageList.push(option1_image)
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].option2_image_count) <= 1) && option2_image) {
                deleteImageList.push(option2_image)
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].option3_image_count) <= 1) && option3_image) {
                deleteImageList.push(option3_image)
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].option4_image_count) <= 1) && option4_image) {
                deleteImageList.push(option4_image)
                deleteImageFlag = true
            }
            if ((Number(imagecount.rows[0].option5_image_count) <= 1) && option5_image) {
                deleteImageList.push(option5_image)
                deleteImageFlag = true
            }

            await client.query(dbQuery.revisionDataDeleteByCardQuery, [cardId]);
            await client.query(dbQuery.favouriteDataDeleteByCardQuery, [cardId]);

            if (deleteImageFlag) {
                //card image delete
                let cardDeleteResult = await client.query(dbQuery.cardDeleteByIdQuery, [cardId]);
                if (cardDeleteResult.rows[0].card_id && deleteImageList.length > 0) {
                    let cardImageUrl = await client.query(dbQuery.deleteImageUrlByIdQuery, [deleteImageList]);

                    if (cardImageUrl?.rows?.length > 0) {
                        cardImageUrl.rows.map(async imageUrl => {
                            await deleteFile(imageUrl, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName);
                        })
                        await client.query(dbQuery.updateCardCount, [deckId])
                        await client.query('COMMIT');
                        return cardDeleteResult.rows;
                    }
                }
            } else {
                //card delete
                let cardDeleteResult = await client.query(dbQuery.cardDeleteByIdQuery, [cardId]);
                await client.query(dbQuery.updateCardCount, [deckId])
                await client.query('COMMIT');
                return cardDeleteResult.rows;
            }
        }

    }
    catch (error) {
        await client.query('ROLLBACk')
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteCardRepo, operation: config.operation.delete, userId: `` })
    }
    finally {
        client.release()
    }
}

const deleteFavouriteRepo = async (userId, buId, cardId) => {

    try {
        const deleteFavouriteResponse = await pool.query(dbQuery.deleteFavourite, [userId, cardId, buId]);
        return deleteFavouriteResponse?.rows.length > 0;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteFavouriteRepo, operation: config.operation.delete, userId: userId })

    }

}

const deleteReviseRepo = async (userId, buId, cardId) => {
    try {
        const deleteReviseResponse = await pool.query(dbQuery.deleteRevise, [userId, cardId, buId]);
        return deleteReviseResponse?.rows.length > 0;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteReviseRepo, operation: config.operation.delete, userId: userId })
    }

}


const downloadExcelRepo = async () => {
    try {
        const downloadExcelResponse = await pool.query(dbQuery.downloadExcel, []);
        return downloadExcelResponse?.rows.length > 0 ? downloadExcelResponse?.rows[0] : false;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.deleteReviseRepo, operation: config.operation.delete, userId: "" })
    }

}

const addFavouriteRepo = async (userId, buId, cardId) => {

    try {
        const addFavouriteCardResponse = await pool.query(dbQuery.addFavourite, [userId, cardId, buId]);
        return addFavouriteCardResponse?.rows.length > 0;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.addFavouriteRepo, operation: config.operation.post, userId: userId })
    }

}

const addReviseRepo = async (userId, buId, cardId) => {

    try {
        const addReviseCardResponse = await pool.query(dbQuery.addRevise, [userId, cardId, buId]);
        return addReviseCardResponse?.rows.length > 0;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.cardRepo, methodName: config.methodName.addReviseRepo, operation: config.operation.post, userId: userId })

    }

}

module.exports = { downloadExcelRepo, finalCardCheckRepo, getCardByIdRepo, deleteCardRepo, addFavouriteRepo, deleteFavouriteRepo, addReviseRepo, deleteReviseRepo, updateCardImageRepo, deleteImageCardRepo, updateEmptyImageCardRepo, updatecardRepo, getByIdCardRepo, deleteByIdCardRepo, getCardDataByDeckId, addCardRepo, updateCardVisibilityRepo, getCardByIdListRepo }
