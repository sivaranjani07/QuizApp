const commonHandleFunction = require('../common/common_handle_response')
const { errorMessage, response_code, responseMessage, fileName, methodName, operation, fieldName, aws, flashcard } = require('../config/app_config.json')
const { successResponse } = require('./common_service')
const cardRepo = require('../repo/card_repo');
const { Card } = require('../entity/card_entity');
const { fileUpload, deleteFile } = require('../common/fileupload');
const xlsx = require('xlsx');
const cr = require('../common/common_response');
const { validationResult } = require('express-validator');
const axios = require('axios');
const logger = require('../common/logger')
const fs = require('fs');
function optionsList({ data, imageId }) {

    const arr = []
    if (data.option1 || data.option1_image) {
        const option1 = {}
        option1[fieldName.id] = fieldName.a
        option1[fieldName.text] = data.option1 ?? null;
        if (imageId) {
            option1[fieldName.imageId] = data.option1_image?.image_id ?? null;
            option1[fieldName.image] = data.option1_image?.image_url ?? null;
        } else {
            option1[fieldName.image] = data.option1_image ?? null;
        }

        arr.push(option1);
    }
    if (data.option2 || data.option2_image) {
        const option2 = {}
        option2[fieldName.id] = fieldName.b
        option2[fieldName.text] = data.option2 ?? null;
        if (imageId) {
            option2[fieldName.imageId] = data.option2_image?.image_id ?? null;
            option2[fieldName.image] = data.option2_image?.image_url ?? null;
        } else {
            option2[fieldName.image] = data.option2_image ?? null;
        }
        arr.push(option2);
    }
    if (data.option3 || data.option3_image) {
        const option3 = {}
        option3[fieldName.id] = fieldName.c
        option3[fieldName.text] = data.option3 ?? null;
        if (imageId) {
            option3[fieldName.imageId] = data.option3_image?.image_id ?? null;
            option3[fieldName.image] = data.option3_image?.image_url ?? null;
        } else {
            option3[fieldName.image] = data.option3_image ?? null;
        }

        arr.push(option3);
    }
    if (data.option4 || data.option4_image) {
        const option4 = {}
        option4[fieldName.id] = fieldName.d
        option4[fieldName.text] = data.option4 ?? null;
        if (imageId) {
            option4[fieldName.imageId] = data.option4_image?.image_id ?? null;
            option4[fieldName.image] = data.option4_image?.image_url ?? null;
        } else {
            option4[fieldName.image] = data.option4_image ?? null;
        }

        arr.push(option4);
    }
    if (data.option5 || data.option5_image) {
        const option5 = {}
        option5[fieldName.id] = fieldName.e
        option5[fieldName.text] = data.option5 ?? null;
        if (imageId) {
            option5[fieldName.imageId] = data.option5_image?.image_id ?? null;
            option5[fieldName.image] = data.option5_image?.image_url ?? null;
        } else {
            option5[fieldName.image] = data.option5_image ?? null;
        }

        arr.push(option5);
    }

    return arr;
}

async function createCardService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let addCardResponse;

                let fileData = await fileUpload(req, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);

                if (fileData?.header?.code == '600') {
                    req.body.questionImage = fileData?.body.value?.questionImage?.length > 0 ? fileData.body.value.questionImage[0] : '';
                    req.body.hintImage = fileData?.body.value?.hintImage?.length > 0 ? fileData.body.value.hintImage[0] : '';
                    req.body.option1Image = fileData?.body.value?.option1Image?.length > 0 ? fileData.body.value.option1Image[0] : '';
                    req.body.option2Image = fileData?.body.value?.option2Image?.length > 0 ? fileData.body.value.option2Image[0] : '';
                    req.body.option3Image = fileData?.body.value?.option3Image?.length > 0 ? fileData.body.value.option3Image[0] : '';
                    req.body.option4Image = fileData?.body.value?.option4Image?.length > 0 ? fileData.body.value.option4Image[0] : '';
                    req.body.option5Image = fileData?.body.value?.option5Image?.length > 0 ? fileData.body.value.option5Image[0] : '';

                    addCardResponse = await cardRepo.addCardRepo(req.body, req.token);
                }
                if (addCardResponse > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: responseMessage.cardCreated })
                        ),
                    });
                }
                else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                            cr.bodyCb({ val: responseMessage.unhandled })
                        )
                    })
                }
            }),
            res: res,
            fileName: fileName.cardService,
            methodName: methodName.createCardService,
            userId: `${req.token.userId}`,
            operation: operation.post,
            errorMessage: errorMessage
        })
}

async function updateCardByIdService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let options = req.body?.options ?? [];
                for (let option of options) {
                    Object.assign(req.body, option);
                }
                let updateCardResponse = await cardRepo.updatecardRepo(req.body, req.token);
                if (updateCardResponse?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: responseMessage.cardUpdated })
                        ),
                    });
                }
                else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                            cr.bodyCb({ val: responseMessage.noDataFound })
                        )
                    })
                }
            }),
            res: res,
            fileName: fileName.cardService,
            methodName: methodName.updateCardByIdService,
            userId: ``,
            operation: operation.update,
            errorMessage: errorMessage
        })
}

async function deleteCardImageService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let finalResult;

                let columnName;

                if (req.query?.type == fieldName.questionImages) {
                    columnName = fieldName.questionImage
                }
                if (req.query?.type == fieldName.hintImages) {
                    columnName = fieldName.hintImage
                }
                if (req.query?.type == fieldName.option1Images) {
                    columnName = fieldName.option1Image
                }
                if (req.query?.type == fieldName.option2Images) {
                    columnName = fieldName.option2Image
                }
                if (req.query?.type == fieldName.option3Images) {
                    columnName = fieldName.option3Image
                }
                if (req.query?.type == fieldName.option4Images) {
                    columnName = fieldName.option4Image
                }
                if (req.query?.type == fieldName.option5Images) {
                    columnName = fieldName.option5Image
                }


                let updateImageCardResult = await cardRepo.updateEmptyImageCardRepo(columnName, req.query.cardId, req.token.buId, req.token.userId);

                if (updateImageCardResult > 0) {
                    let deleteImageCardResult = await cardRepo.deleteImageCardRepo(req.query?.imageId);

                    if (deleteImageCardResult?.image_url) {
                        //s3 bucket flow
                        let deleteImageCardBucketResult = await deleteFile(deleteImageCardResult.image_url, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);

                        if (deleteImageCardBucketResult.header.code == '600') {
                            finalResult = responseMessage.cardImageDeleted;
                        }
                    } else {

                        finalResult = responseMessage.cardImageDeleted;

                    }
                }

                if (finalResult) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: responseMessage.cardImageDeleted })
                        ),
                    });
                }
                else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.no_data_found }),
                            cr.bodyCb({ val: responseMessage.noDataFound })
                        )
                    })
                }



            }),
            res: res,
            fileName: fileName.cardService,
            methodName: methodName.deleteCardByIdService,
            userId: `${req.token.userId}`,
            operation: operation.delete,
            errorMessage: errorMessage
        })
}

async function updateCardImageService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let updateImageCardResult;
            let fileData = await fileUpload(req, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);
            if (fileData?.body.value.image) {
                req.body.image = fileData?.body.value.image;

                let columnName;

                if (req.body?.type == fieldName.questionImages) {
                    columnName = fieldName.questionImage
                }
                if (req.body?.type == fieldName.hintImages) {
                    columnName = fieldName.hintImage
                }
                if (req.body?.type == fieldName.option1Images) {
                    columnName = fieldName.option1Image
                }
                if (req.body?.type == fieldName.option2Images) {
                    columnName = fieldName.option2Image
                }
                if (req.body?.type == fieldName.option3Images) {
                    columnName = fieldName.option3Image
                }
                if (req.body?.type == fieldName.option4Images) {
                    columnName = fieldName.option4Image
                }
                if (req.body?.type == fieldName.option5Images) {
                    columnName = fieldName.option5Image
                }


                updateImageCardResult = await cardRepo.updateCardImageRepo(req.body.image, req.body.cardId, columnName, req.token, req.body.imageId);

            }

            if (updateImageCardResult > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.cardImageUpdated })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    )
                })
            }



        }),
        res: res,
        fileName: fileName.cardService,
        methodName: methodName.updateCardImageService,
        userId: req.token.buId,
        operation: operation.delete,
        errorMessage: errorMessage
    })
}


async function deleteCardByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({

        successCb: (async (successCb) => {

            let finalCardCheckResult = await cardRepo.finalCardCheckRepo(req.query.cardId);

            if (finalCardCheckResult > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: responseMessage.lastCard })
                    )
                })

            } else {
                let cardDataResult = await cardRepo.getCardByIdRepo(req.query.cardId);
                if (cardDataResult.length > 0) {
                    let cardDeleteResult = await cardRepo.deleteCardRepo(req.query.cardId, req.query.deckId);
                    if (cardDeleteResult?.length > 0) {
                        successCb({
                            data: cr.responseCb(
                                cr.headerCb({ code: response_code.success }),
                                cr.bodyCb({ val: responseMessage.cardDeleted })
                            )
                        })
                    } else {
                        successCb({
                            data: cr.responseCb(
                                cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                                cr.bodyCb({ val: responseMessage.lastCard })
                            )
                        })
                    }
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.no_data_found }),
                            cr.bodyCb({ val: responseMessage.noDataFound })
                        )
                    })
                }
            }


        }),
        res: res,
        fileName: fileName.cardService,
        methodName: methodName.deleteCardByIdService,
        userId: req.token.buId,
        operation: operation.delete,
        errorMessage: errorMessage
    })
}

async function getCardByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let finalData;
            let cardResponse;
            if (req.params.cardId) {
                cardResponse = await cardRepo.getByIdCardRepo(req.params.cardId, req.token.buId);
            }

            if (cardResponse && cardResponse.length > 0) {
                const data = new Card({});
                cardResponse[0].options = optionsList({ data: cardResponse[0], imageId: true })
                data.cardId = cardResponse[0].card_id,
                    data.question = cardResponse[0].question,
                    data.questionImageId = cardResponse[0].question_image?.image_id ?? null
                data.questionImage = cardResponse[0].question_image?.image_url ?? null,
                    data.solution = cardResponse[0].solution ?? "",
                    data.options = cardResponse[0].options,
                    data.hintText = cardResponse[0].hint,
                    data.hintImageId = cardResponse[0].hint_image?.image_id ?? null
                data.hintImage = cardResponse[0].hint_image?.image_url ?? null
                data.questionType = cardResponse[0].type
                finalData = data;
            }

            if (finalData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: finalData })

                    )
                })

            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ err: responseMessage.noDataFound })

                    )
                })
            }


        }),
        res: res,
        errorMessage: errorMessage,
        fileName: fileName.cardService,
        methodName: methodName.getCardByIdService,
        userId: req.token.buId,
        operation: operation.get
    })


}


async function updateCardVisibilityService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let deckDataUpdateResponse = await cardRepo.updateCardVisibilityRepo(req.body, req.token);

                if (deckDataUpdateResponse) {
                    successResponse({
                        successCb: successCb,
                        data: responseMessage.cardVisibilityUpdated
                    })
                }
                else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                            cr.bodyCb({ val: responseMessage.unhandled })
                        )
                    })
                }


            }),
            res: res,
            fileName: fileName.cardService,
            methodName: methodName.updateCardVisibilityService,
            userId: req.token.buId,
            operation: operation.update,
            errorMessage: errorMessage
        })
}

async function getCardByIdListService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            const finalData = [];
            let cardResponseList;
            if (req?.params?.deckId) {
                cardResponseList = await cardRepo.getCardByIdListRepo(req.params.deckId, req.token.buId, req.token.userId);
            }
            if (cardResponseList?.length > 0) {

                cardResponseList.map(card => {
                    const data = new Card({});
                    card[fieldName.options] = optionsList({ data: card, imageId: false })

                    data.cardId = card.card_id,
                        data.question = card.question,
                        data.questionImage = card.question_image,
                        data.solution = card.solution,
                        data.options = card.options,
                        data.hintText = card.hint ? card.hint : "",
                        data.hintImage = card.hint_image,
                        data.favourite = card.favourite > 0 ? true : false
                    data.type = card.type
                    finalData.push(data)
                })
            }
            successResponse({
                successCb: successCb,
                data: finalData
            })


        }),
        res: res,
        errorMessage: errorMessage,
        fileName: fileName.cardService,
        methodName: methodName.getCardByIdService,
        userId: req.token.buId,
        operation: operation.get
    })


}

async function addFavouriteService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            const { buId, userId } = req.token
            let cardDataResponse;
            if (req.body.visible) {
                cardDataResponse = await cardRepo.addFavouriteRepo(userId, buId, req.body.cardId);
            } else {
                cardDataResponse = await cardRepo.deleteFavouriteRepo(userId, buId, req.body.cardId);
            }


            if (cardDataResponse) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.cardUpdated })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }






        }), res: res, errorMessage: errorMessage, fileName: fileName.cardService, methodName: methodName.addFavouriteService, userId: req.token.buId, operation: operation.delete
    })
}

async function addReviseService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            const { buId, userId } = req.token
            let reviseCardAddResponse = await cardRepo.addReviseRepo(userId, buId, req.body.cardId);
            if (reviseCardAddResponse) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.cardAdded })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }






        }), res: res, errorMessage: errorMessage, fileName: fileName.cardService, methodName: methodName.addReviseService, userId: req.token.buId, operation: operation.delete
    })
}


async function deleteReviseService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            const { buId, userId } = req.token
            let deleteReviseCardResponse = await cardRepo.deleteReviseRepo(userId, buId, req.body.cardId);

            if (deleteReviseCardResponse) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.cardRemoved })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }






        }), res: res, errorMessage: errorMessage, fileName: fileName.cardService, methodName: methodName.deleteReviseService, userId: req.token.buId, operation: operation.delete
    })
}



async function downloadExcel(req, res) {
    try {

        let downloadExcel = await cardRepo.downloadExcelRepo();
        if (downloadExcel?.excelLink) {
            const destinationPath = `./${flashcard}`;
            const response = await axios.get(downloadExcel.excelLink, { responseType: 'arraybuffer' });
            fs.writeFileSync(destinationPath, response.data);
            res.setHeader('Content-Disposition', 'attachment; filename="FlashCard.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const fileStream = fs.createReadStream(destinationPath);
            fileStream.pipe(res);
            logger.infos({ file_name: fileName.cardService, method_name: methodName.excel, userid: '' ?? ``, operation: logger.operation.create, subOperation: logger.subOperation.exit, result: logger.result.success, label: ``, errorcode: response_code.success })
            fileStream.on('close', () => {
                fs.unlinkSync(destinationPath);
            });
        } else {
            logger.infos({ file_name: fileName.cardService, method_name: methodName.excel, userid: '' ?? ``, operation: logger.operation.create, subOperation: logger.subOperation.exit, result: logger.result.success, label: ``, errorcode: response_code.no_data_found })
            return res.send({
                header: {
                    code: response_code.no_data_found
                }, body: {
                    value: responseMessage.noDataFound,
                    error: null
                }
            })
        }
    } catch (error) {
        logger.infos({ file_name: fileName.cardService, method_name: methodName.excel, userid: '' ?? ``, operation: logger.operation.create, subOperation: logger.subOperation.exit, result: logger.result.success, label: ``, errorcode: response_code.error_dbissue_serverissue })
        return res.send({
            header: {
                code: response_code.error_dbissue_serverissue
            }, body: {
                value: errorMessage.unhandled,
                error: null
            }
        })
    }
}






module.exports = {
    downloadExcel,
    deleteCardImageService,
    createCardService,
    getCardByIdService,
    updateCardByIdService,
    deleteCardByIdService,
    updateCardVisibilityService,
    updateCardImageService,
    getCardByIdListService,
    addFavouriteService,
    addReviseService,
    deleteReviseService
}
