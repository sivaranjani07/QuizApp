const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const config = require('../config/app_config.json')
const moment = require('moment');
const fileUpload = require("../common/fileupload");
const { handleError } = require('../common/error_handler');
let date = moment().format('YYYY-MM-DD HH:mm:ss');


const addDeckRepo = async (body, cardList, buId, userId) => {
    let client = await pool.connect();
    try {
       
        await client.query('BEGIN')
        let deckAddResult;
        let imageIdResponse;
        let randomImageResult;
        if (body.image_url) {
            imageIdResponse = await client.query(dbQuery.ImageAddQuery, body.image_url);
        } else {
            randomImageResult = await client.query(dbQuery.getRandomImage);
        }



        let cardAddResult;
        deckAddResult = await client.query(dbQuery.deckAddQuery, [
            buId,
            body.deckName,
            body.difficultyLevel,
            body.subject,
            body.topic,
            body.subTopic ? body.subTopic : '',
            body.exam ? body.exam : '',
            body.standard ? body.standard : '',
            true,
            imageIdResponse?.rows[0]?.image_id ? imageIdResponse?.rows[0]?.image_id : null,
            `'${body.file_link}'`,
            date,
            userId,
            cardList.length,
            randomImageResult?.rows[0]?.image_id ? randomImageResult?.rows[0]?.image_id : null,
        ])


        if (deckAddResult?.rows[0]?.deck_id) {
            for (let cardData of cardList) {

                for (let data in cardData) {
                    let imageAddResponse;
                    if (data == config.fieldName.questionImage && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);
                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id
                        if (imageAddResponse?.rows?.length > 0) {

                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }

                        else {

                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.hintImage && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);
                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id

                        if (imageAddResponse?.rows?.length > 0) {

                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.option1Image && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);

                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id

                        if (imageAddResponse?.rows?.length > 0) {
                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.option2Image && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);

                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id

                        if (imageAddResponse?.rows?.length > 0) {
                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.option3Image && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);

                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id
                        if (imageAddResponse?.rows?.length > 0) {
                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.option4Image && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);

                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id
                        if (imageAddResponse?.rows?.length > 0) {
                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }
                    if (data == config.fieldName.option5Image && cardData[data]) {
                        let getImageIdResponse = await client.query(dbQuery.getImageIdQuery, [cardData[data]]);

                        imageAddResponse = getImageIdResponse.rowCount == 0 ? await client.query(dbQuery.ImageAddQuery, [cardData[data]]) : getImageIdResponse.rows[0].image_id

                        if (imageAddResponse?.rows?.length > 0) {
                            cardData[data] = imageAddResponse.rows[0].image_id;
                            imageAddResponse = null;
                        }
                        else {
                            cardData[data] = imageAddResponse;
                            imageAddResponse = null;
                        }
                    }

                }


                cardAddResult = await client.query(dbQuery.cardAddQuery, [
                    buId,
                    cardData.question,
                    cardData.question_image ? cardData.question_image : null,
                    cardData.solution,
                    cardData.option1 != undefined ? cardData.option1 : null,
                    cardData.option2 != undefined ? cardData.option2 : null,
                    cardData.option3 != undefined ? cardData.option3 : null,
                    cardData.option4 != undefined ? cardData.option4 : null,
                    cardData.option5 != undefined ? cardData.option5 : null,
                    cardData.option1_image ? cardData.option1_image : null,
                    cardData.option2_image ? cardData.option2_image : null,
                    cardData.option3_image ? cardData.option3_image : null,
                    cardData.option4_image ? cardData.option4_image : null,
                    cardData.option5_image ? cardData.option5_image : null,
                    cardData.hint,
                    cardData.hint_image ? cardData.hint_image : null,
                    true,
                    date,
                    userId,
                    deckAddResult.rows[0].deck_id,
                    cardData.type
                ])

            }

        }
        else {
            await client.query('COMMIT')
            return deckAddResult.rowCount
        }

        await client.query('COMMIT')
        return cardAddResult.rowCount;

    } catch (error) {
        await client.query('ROLLBACK')
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.addDeckRepo, operation: config.operation.post, userId: buId })
    }
    finally {
        client.release();
    }
}

const updateDeckRepo = async (body, buId, userId) => {
    try {
        let deckUpdateResult = await pool.query(dbQuery.deckUpdateQuery, [
            body.deckName,
            body.difficultyLevel,
            body.subject,
            body.topic,
            body.subTopic ? body.subTopic : '',
            body.exam ? body.exam : '',
            body.standard ? body.standard : '',
            date,
            userId,
            body.deckId,
            buId,
        ])

        return deckUpdateResult.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.updateDeckRepo, operation: config.operation.update, userId: userId })
    }


}

const updateDeckCoverImageRepoById = async (body, imageUrl, buId, userId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN')
        let updateCoverImageIdResponse;
        let imageUrlRes;
        let updateImageUrlResposne;
        //image null in deck table
        if (body.imageId) {
            let deleteImageRespone = await client.query(dbQuery.deckCoverImageDelete, [body.deckId, body.imageId, buId, userId]);
            if (deleteImageRespone.rowCount > 0 || deleteImageRespone.rows[0].deck_id) {
                //delete image from images table
                imageUrlRes = await client.query(dbQuery.imageDeleteQuery, [body.imageId])
               
                if (imageUrlRes?.rows[0]?.image_url) {
                    //remove from s3 bucket
                     await fileUpload.deleteFile(imageUrlRes.rows[0].image_url, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName);
                        updateImageUrlResposne = await client.query(dbQuery.ImageAddQuery, [imageUrl]);
                        if (updateImageUrlResposne?.rows[0]?.image_id) {
                            updateCoverImageIdResponse = await client.query(dbQuery.updateDeckCoverImageQuery, [updateImageUrlResposne.rows[0].image_id, body.deckId, buId, userId, moment().format('YYYY-MM-DD HH:mm:ss')])
                        }
                }
            }
        }
        else {
            updateImageUrlResposne = await client.query(dbQuery.ImageAddQuery, [imageUrl]);
            if (updateImageUrlResposne?.rows[0]?.image_id) {
                updateCoverImageIdResponse = await client.query(dbQuery.updateDeckCoverImageQuery, [updateImageUrlResposne.rows[0].image_id, body.deckId, buId, userId, moment().format('YYYY-MM-DD HH:mm:ss')])
            }
        }


        await client.query('COMMIT')
        return updateCoverImageIdResponse.rowCount ? updateCoverImageIdResponse.rowCount : [];

    } catch (error) {
        await client.query('ROLLBACK')
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.updateDeckCoverImageRepoById, operation: config.operation.update, userId: userId })


    }
    finally {
        client.release()
    }
}

const deleteCoverImageByIdRepo = async (body, buId, userId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN')
        let imageUrl
        let deleteImageRespone = await client.query(dbQuery.deckCoverImageDelete, [body.deckId, body.imageId, buId, userId]);
        if (deleteImageRespone.rowCount > 0 || deleteImageRespone.rows[0].deck_id) {
            imageUrl = await client.query(dbQuery.imageDeleteQuery, [body.imageId])

        }
        await client.query('COMMIT')
        return imageUrl;
    } catch (error) {
        await client.query('ROLLBACK')
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.deleteCoverImageByIdRepo, operation: config.operation.delete, userId: userId })

    }
    finally {
        client.release()
    }

}


const getAllDeckRepo = async (id) => {
    try {
        const getAllDeckResponse = await pool.query(dbQuery.deckGetAllQuery, [id]);
        return getAllDeckResponse.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getAllDeckRepo, operation: config.operation.get, userId: id })
    }
}

const editGetAllDeckRepo = async (sectionId, buId) => {
    try {

        const editGetAllResponse = await pool.query(dbQuery.editeGetAlldecks, [sectionId, buId]);
        return editGetAllResponse?.rows ?? [];
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.editGetAllDeckRepo, operation: config.operation.get, userId: buId })
    }
}

const getByIdDeckAndCardRepo = async (deckId, buId) => {
    try {
        const getDeckandCardResponse = await pool.query(dbQuery.deckandCardGetByIdQuery, [deckId, buId]);
        return getDeckandCardResponse.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getByIdDeckAndCardRepo, operation: config.operation.get, userId: buId })
    }
}

const getByIdDeckRepo = async (deckId, buId) => {
    try {
        const getDeckresponse = await pool.query(dbQuery.deckGetByIdQuery, [deckId, buId]);
        return getDeckresponse.rows;
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getByIdDeckRepo, operation: config.operation.get, userId: buId })
    }

}



//not used
const searchDeckRepo = async (searchValue, buId) => {
    try {
        let subjectValue = searchValue + '%';
        const res = await pool.query(dbQuery.deckSearchQuery, [subjectValue, buId]);
        return res.rows
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.searchDeckRepo, operation: config.operation.get, userId: buId })
    }

}

const updateDeckVisibilityRepoById = async (body, buId, userId) => {
    try {
        const updateDeckVisibilityResponse = await pool.query(dbQuery.updateDeckVisibilityByIdQuery, [body.deckId, body.visibility, userId, date, buId]);
        return updateDeckVisibilityResponse.rowCount ? updateDeckVisibilityResponse.rowCount : [];
    }
    catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.updateDeckVisibilityRepoById, operation: config.operation.update, userId: buId })
    }


}



//using
const deleteAllDeckByIdRepo = async (deckId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');

        let deckIdExist = await client.query(dbQuery.checkDeckIdExistQuery, [deckId]);
        let RemoveDeckReferenceResponse;
        //checking deckid exist in section_deck_ref table
        if (deckIdExist?.rows[0]?.deck_exists) {
            let sectionCount = await client.query(`select distinct count(deck_id) from section_deck_ref where section_id in (select section_id from section_deck_ref where deck_id=$1) group by section_id having count(deck_id)=1`, [deckId]);
            if (sectionCount?.rows?.length == 0) {
                RemoveDeckReferenceResponse = await client.query(`delete from section_deck_ref where deck_id=$1 returning deck_id`, [deckId])

                if (RemoveDeckReferenceResponse?.rows?.length > 0) {

                    //getting card data  from crad table based on id
                    let cardDetails = await client.query(dbQuery.getCardByDeckIdQuery, [deckId]);
                    let imagecount;
                    let deleteImageList = [];
                    //loop here
                    if (cardDetails?.rows?.length > 0) {
                        for (let data of cardDetails.rows) {
                            //destructuring 
                            let {
                                card_id,
                                question_image,
                                hint_image,
                                option1_image,
                                option2_image,
                                option3_image,
                                option4_image,
                                option5_image
                            } = data

                            //imagecount to check that image id exist more than once or not
                            imagecount = await client.query(`select count(case when question_image=${question_image} or hint_image=${question_image} or option1_image=${question_image} or option2_image=${question_image} or option3_image=${question_image} or option4_image=${question_image} or option5_image=${question_image} then card_id end) as question_image_count,count(case when question_image=${hint_image} or hint_image=${hint_image} or option1_image=${hint_image} or option2_image=${hint_image} or option3_image=${hint_image} or option4_image=${hint_image} or option5_image=${hint_image} then card_id end) as hint_image_count,count(case when question_image=${option1_image} or hint_image=${option1_image} or option1_image=${option1_image} or option2_image=${option1_image} or option3_image=${option1_image} or option4_image=${option1_image} or option5_image=${option1_image} then card_id end) as option1_image_count,count(case when question_image=${option2_image} or hint_image=${option2_image} or option1_image=${option2_image} or option2_image=${option2_image} or option3_image=${option2_image} or option4_image=${option2_image} or option5_image=${option2_image} then card_id end) as option2_image_count,count(case when question_image=${option3_image} or hint_image=${option3_image} or option1_image=${option3_image} or option2_image=${option3_image} or option3_image=${option3_image} or option4_image=${option3_image} or option5_image=${option3_image} then card_id end) as option3_image_count,count(case when question_image=${option4_image} or hint_image=${option4_image} or option1_image=${option4_image} or option2_image=${option4_image} or option3_image=${option4_image} or option4_image=${option4_image} or option5_image=${option4_image} then card_id end)as option4_image_count,count(case when question_image=${option5_image} or hint_image=${option5_image} or option1_image=${option5_image} or option2_image=${option5_image} or option3_image=${option5_image} or option4_image=${option5_image} or option5_image=${option5_image} then card_id end) as option5_image_count from card`)

                            let deleteFlag = false

                            //if image_id count is more than one push id to deleteImageList
                            if (Number(imagecount.rows[0].question_image_count) <= 1 && question_image) {
                                deleteImageList.push(question_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].hint_image_count) <= 1 && hint_image) {
                                deleteImageList.push(hint_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].option1_image_count) <= 1 && option1_image) {
                                deleteImageList.push(option1_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].option2_image_count) <= 1 && option2_image) {
                                deleteImageList.push(option2_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].option3_image_count) <= 1 && option3_image) {
                                deleteImageList.push(option3_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].option4_image_count) <= 1 && option4_image) {
                                deleteImageList.push(option4_image)
                                deleteFlag = true
                            }

                            if (Number(imagecount.rows[0].option5_image_count) <= 1 && option5_image) {
                                deleteImageList.push(option5_image)
                                deleteFlag = true
                            }

                            //delete deck_id from revision and favourite table based on deck_id

                            await client.query(dbQuery.revisionDataDeleteByCardIdQuery, [card_id]);
                            await client.query(dbQuery.favouriteDeckDataDeleteByCardIdQuery, [card_id]);


                            //imageCount<1
                            if (deleteFlag) {
                                //first delete the card data based on id and returing deck_id
                                let cardResult = await client.query(dbQuery.cardDeleteByDeckIdQuery, [deckId, card_id]);
                                // //if id returned
                                if (cardResult?.rows[0]?.deck_id && deleteImageList.length > 0) {
                                    //delete images from image table
                                    let cardImageUrl = await client.query(dbQuery.deleteImageUrlByIdQuery, [deleteImageList]);
                                    if (cardImageUrl?.rowCount > 0) {
                                        const imageURLs = [];
                                        for (const obj of cardImageUrl.rows) {
                                            const imageURL = obj.image_url;
                                            imageURLs.push(imageURL);
                                        }
                                        //delete image from s3bucket
                                        await fileUpload.deleteAllFile(imageURLs, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName)
                                    }

                                }
                            }
                            else {

                                //delete card based on cardId and deck_id
                                await client.query(dbQuery.cardDeleteByDeckIdQuery, [deckId, card_id])
                            }
                        }
                    }

                    await client.query(dbQuery.deleteByDeckIdQuery, [deckId])
                    let deckImageId = await client.query(dbQuery.deckDeleteByIdQuery, [deckId])

                    if (deckImageId?.rows[0]?.image_id) {
                        let deckImageUrl = await client.query(dbQuery.imageDeleteQuery, [deckImageId.rows[0].image_id])

                        if (deckImageUrl?.rows[0]?.image_url) {

                            await fileUpload.deleteFile(deckImageUrl?.rows[0].image_url, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName);

                            await client.query('COMMIT');
                            return true;
                        } else {
                            await client.query('COMMIT');
                            return true
                        }
                    }
                    else {
                        await client.query('COMMIT');
                        return true
                    }
                }
            }


            // //exactly one deck_id=> returning error message 
            else {
                await client.query('COMMIT');
                return []
            }
        }

        //not exist
        else {
            let cardDetails = await client.query(dbQuery.getCardByDeckIdQuery, [deckId]);
            let imagecount;
            let deleteImageList = [];
            //loop here
            if (cardDetails?.rows?.length > 0) {
                for (let data of cardDetails.rows) {
                    //destructuring 
                    let {
                        card_id,
                        question_image,
                        hint_image,
                        option1_image,
                        option2_image,
                        option3_image,
                        option4_image,
                        option5_image
                    } = data
                    //imagecount to check that image id exist more than once or not
                    imagecount = await client.query(`select count(case when question_image=${question_image} or hint_image=${question_image} or option1_image=${question_image} or option2_image=${question_image} or option3_image=${question_image} or option4_image=${question_image} or option5_image=${question_image} then card_id end) as question_image_count,count(case when question_image=${hint_image} or hint_image=${hint_image} or option1_image=${hint_image} or option2_image=${hint_image} or option3_image=${hint_image} or option4_image=${hint_image} or option5_image=${hint_image} then card_id end) as hint_image_count,count(case when question_image=${option1_image} or hint_image=${option1_image} or option1_image=${option1_image} or option2_image=${option1_image} or option3_image=${option1_image} or option4_image=${option1_image} or option5_image=${option1_image} then card_id end) as option1_image_count,count(case when question_image=${option2_image} or hint_image=${option2_image} or option1_image=${option2_image} or option2_image=${option2_image} or option3_image=${option2_image} or option4_image=${option2_image} or option5_image=${option2_image} then card_id end) as option2_image_count,count(case when question_image=${option3_image} or hint_image=${option3_image} or option1_image=${option3_image} or option2_image=${option3_image} or option3_image=${option3_image} or option4_image=${option3_image} or option5_image=${option3_image} then card_id end) as option3_image_count,count(case when question_image=${option4_image} or hint_image=${option4_image} or option1_image=${option4_image} or option2_image=${option4_image} or option3_image=${option4_image} or option4_image=${option4_image} or option5_image=${option4_image} then card_id end)as option4_image_count,count(case when question_image=${option5_image} or hint_image=${option5_image} or option1_image=${option5_image} or option2_image=${option5_image} or option3_image=${option5_image} or option4_image=${option5_image} or option5_image=${option5_image} then card_id end) as option5_image_count from card`)
                    let deleteFlag = false
                    //if image_id count is more than one push id to deleteImageList
                    if (Number(imagecount.rows[0].question_image_count) <= 1 && question_image) {
                        deleteImageList.push(question_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].hint_image_count) <= 1 && hint_image) {
                        deleteImageList.push(hint_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].option1_image_count) <= 1 && option1_image) {
                        deleteImageList.push(option1_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].option2_image_count) <= 1 && option2_image) {
                        deleteImageList.push(option2_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].option3_image_count) <= 1 && option3_image) {
                        deleteImageList.push(option3_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].option4_image_count) <= 1 && option4_image) {
                        deleteImageList.push(option4_image)
                        deleteFlag = true
                    }

                    if (Number(imagecount.rows[0].option5_image_count) <= 1 && option5_image) {

                        deleteImageList.push(option5_image)
                        deleteFlag = true
                    }

                    //delete deck_id from revision and favourite table based on deck_id

                    await client.query(dbQuery.revisionDataDeleteByCardIdQuery, [card_id]);
                    await client.query(dbQuery.favouriteDeckDataDeleteByCardIdQuery, [card_id]);


                    //imageCount<1
                    if (deleteFlag) {
                        //first delete the card data based on id and returing deck_id

                        let cardResult = await client.query(dbQuery.cardDeleteByDeckIdQuery, [deckId, card_id]);
                        // //if id returned
                        if (cardResult?.rows[0]?.deck_id && deleteImageList.length > 0) {
                            //delete images from image table
                            let cardImageUrl = await client.query(dbQuery.deleteImageUrlByIdQuery, [deleteImageList]);

                            if (cardImageUrl?.rowCount > 0) {
                                const imageURLs = [];
                                for (const obj of cardImageUrl.rows) {
                                    const imageURL = obj.image_url;
                                    imageURLs.push(imageURL);
                                }
                                //delete image from s3bucket
                                await fileUpload.deleteAllFile(imageURLs, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : config.aws.bucketName)
                            }

                        }
                    }
                    else {
                        //delete card based on deck_id
                         await client.query(dbQuery.cardDeleteByDeckIdQuery, [deckId, card_id])
                    }
                }

            }

            await client.query(dbQuery.deleteByDeckIdQuery, [deckId])
            let deckImageId = await client.query(dbQuery.deckDeleteByIdQuery, [deckId])

            if (deckImageId?.rows[0]?.image_id) {
                let deckImageUrl = await client.query(dbQuery.imageDeleteQuery, [deckImageId.rows[0].image_id])

                if (deckImageUrl?.rows[0]?.image_url) {

                    await fileUpload.deleteFile(deckImageUrl?.rows[0].image_url, 'raeen-doc-uploads');

                    await client.query('COMMIT');
                    return true;
                } else {
                    await client.query('COMMIT');
                    return true
                }
            }
            else {
                await client.query('COMMIT');
                return true
            }
        }
    }

    catch (error) {
        await client.query('ROLLBACK')
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.deleteAllDeckByIdRepo, operation: config.operation.delete, userId: `` })
    }
    finally {
        client.release();
    }
}

const searchDeckByNameRepo = async (deckName, buId) => {
    try {
        let name = deckName + '%';
        let searchDeckResponse = await pool.query(dbQuery.searchDeckByNameQuery, [name, buId])
        return searchDeckResponse.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.searchDeckByNameRepo, operation: config.operation.get, userId: buId })
    }
}

const trendingSearchDeckByNameRepo = async (deckName, buId) => {
    try {
        let name = deckName + '%';
        let searchDeckResponse = await pool.query(dbQuery.trendingSearchDeckByNameQuery, [name, buId])
        return searchDeckResponse?.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.searchDeckByNameRepo, operation: config.operation.get, userId: buId })
    }
}



const getAllDeckByNameRepo = async (deckId, buId) => {
    try {
        let getDeckAllResponse = await pool.query(dbQuery.getAllDeckByNameQuery, [deckId, buId])

        return getDeckAllResponse.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getAllDeckByNameRepo, operation: config.operation.get, userId: buId })
    }
}


const getTrendingRepo = async (Id, startDate, enddate, limit) => {
    try {
        const dbDeckResponse = await pool.query(dbQuery.getTrending, [Id, startDate, enddate, limit]);
        if (dbDeckResponse?.rows.length > 0) {
            return dbDeckResponse.rows;
        } else {
            return false;
        }

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getTrendingRepo, operation: config.operation.get, userId: Id })

    }

}

const getMyDeckRepo = async (buId, userId) => {
    try {
        const favouriteCardData = await pool.query(dbQuery.getFavorite, [buId, userId]);
        const reviseCardData = await pool.query(dbQuery.getMyDeck, [buId, userId]);
        if (favouriteCardData?.rows.length > 0 || reviseCardData?.rows.length > 0) {
            return { reviseCardsCount: reviseCardData.rows[0].count ?? 0, favouriteCardsCount: favouriteCardData.rows[0].count ?? 0 };
        } else {
            return false;
        }

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getMyDeckRepo, operation: config.operation.get, userId: buId })

    }

}

const getNameDeckRepo = async (sectionId, text, buId) => {
    try {
        const filterTex = text + '%';
        const searchResults = await pool.query(dbQuery.searchQueryForGetDeckName, [sectionId, filterTex, buId]);
        return searchResults.rows;

    } catch (error) {
        handleError({ error: error, fileName: config.fileName.deckRepo, methodName: config.methodName.getNameDeckRepo, operation: config.operation.get, userId: buId })

    }

}

module.exports = { trendingSearchDeckByNameRepo, getNameDeckRepo, editGetAllDeckRepo, getMyDeckRepo, getTrendingRepo, getAllDeckByNameRepo, searchDeckByNameRepo, deleteAllDeckByIdRepo, deleteCoverImageByIdRepo, addDeckRepo, getAllDeckRepo, getByIdDeckRepo, getByIdDeckAndCardRepo, searchDeckRepo, updateDeckRepo, updateDeckVisibilityRepoById, updateDeckCoverImageRepoById }
