const commonHandleFunction = require('../common/common_handle_response')
const { errorMessage, responseMessage, fileName, methodName, operation, response_code, fieldName, aws } = require('../config/app_config.json')
const { successResponse } = require('./common_service')
const deckRepo = require('../repo/deck_repo');
const fileUpload = require("../common/fileupload");
const reader = require('xlsx');
const { Deck } = require('../entity/deck_entity');
const { Card } = require('../entity/card_entity');
const cr = require('../common/common_response');
const { validationResult } = require('express-validator');


async function readFile(fileName) {
    let cardDataList = []
    try {
        const file = reader.read(fileName?.files?.file[0]?.buffer, { type: 'buffer' });
        const sheetNames = file.SheetNames
        const fileData = reader.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
        fileData?.forEach((data) => {
            if (Object.keys(data).length > 1) {
                cardDataList.push(data)
            }
        })
        return cardDataList;
    } catch (err) {
        
        return []
    }
}

function optionsList(data) {
    const arr = []
    if (data.option1 || data.option1_image) {
        const option1 = {}
        option1[fieldName.id] = fieldName.a ?? null
        option1[fieldName.text] = data.option1 ?? null
        option1[fieldName.image] = data.option1_image ?? null

        arr.push(option1);

    }
    if (data.option2 || data.option2_image) {
        const option2 = {}
        option2[fieldName.id] = fieldName.b ?? null
        option2[fieldName.text] = data.option2 ?? null
        option2[fieldName.image] = data.option2_image ?? null

        arr.push(option2);
    }
    if (data.option3 || data.option3_image) {
        const option3 = {}
        option3[fieldName.id] = fieldName.c ?? null
        option3[fieldName.text] = data.option3 ?? null
        option3[fieldName.image] = data.option3_image ?? null

        arr.push(option3);
    }
    if (data.option4 || data.option4_image) {
        const option4 = {}
        option4[fieldName.id] = fieldName.d ?? null
        option4[fieldName.text] = data.option4 ?? null
        option4[fieldName.image] = data.option4_image ?? null

        arr.push(option4);
    }
    if (data.option5 || data.option5_image) {
        const option5 = {}
        option5[fieldName.id] = fieldName.e ?? null
        option5[fieldName.text] = data.option5 ?? null
        option5[fieldName.image] = data.option5_image ?? null
        arr.push(option5);
    }

    return arr;

}



async function createDeckService(req, res) {

    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let excelFieldFlag = false;
            let deckAddResults;
            let data;
            let fileData = await fileUpload.fileUpload(req, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);
            if (fileData?.header?.code == '600') {
                req.body.file_link = fileData?.body?.value?.file?.length > 0 ? fileData.body.value.file : '';
                req.body.image_url = fileData?.body?.value?.image?.length > 0 ? fileData.body.value.image : ''
                data = await readFile(req);
                let CardList = [];
                if (data?.length > 0) {
                    for (const exceldata of data) {
                        let cardData = {};
                        if (exceldata.question != undefined) {
                            cardData.question = exceldata.question;
                        } else {
                            excelFieldFlag = true
                        }
                        cardData.question_image = exceldata.question_image != undefined ? exceldata.question_image : '';

                        if (exceldata.type != undefined) {
                            cardData.type = exceldata.type;
                        } else {
                            excelFieldFlag = true
                        }
                        cardData.hint = exceldata.hint != undefined ? exceldata.hint : '';
                        cardData.hint_image = exceldata.hint_image != undefined ? exceldata.hint_image : '';

                        if (exceldata.solution != undefined) {
                            cardData.solution = exceldata.solution;
                        } else {
                            excelFieldFlag = true
                        }

                        if (exceldata.type == fieldName.mcq) {
                            if (!((!exceldata.option1 && !exceldata.option2) && (exceldata.option1_image && exceldata.option2_image)) && !((exceldata.option1 && exceldata.option2) && (!exceldata.option1_image && !exceldata.option2_image)) && !((exceldata.option1 && exceldata.option2) && (exceldata.option1_image && exceldata.option2_image)) && !(exceldata.option1 && exceldata.option2_image) && !(exceldata.option1_image && exceldata.option2)) {
                                excelFieldFlag = true
                            }
                        }

                        if (!excelFieldFlag) {

                            cardData.option1 = exceldata.option1 != undefined ? exceldata.option1 : '';
                            cardData.option2 = exceldata.option2 != undefined ? exceldata.option2 : '';
                            cardData.option3 = exceldata.option3 != undefined ? exceldata.option3 : '';
                            cardData.option4 = exceldata.option4 != undefined ? exceldata.option4 : '';
                            cardData.option5 = exceldata.option5 != undefined ? exceldata.option5 : '';

                            cardData.option1_image = exceldata.option1_image != undefined ? exceldata.option1_image : '';
                            cardData.option2_image = exceldata.option2_image != undefined ? exceldata.option2_image : '';
                            cardData.option3_image = exceldata.option3_image != undefined ? exceldata.option3_image : '';
                            cardData.option4_image = exceldata.option4_image != undefined ? exceldata.option4_image : '';
                            cardData.option5_image = exceldata.option5_image != undefined ? exceldata.option5_image : '';
                            CardList.push(cardData);
                        }

                    }
                    if (!excelFieldFlag && CardList?.length > 0) {
                        deckAddResults = await deckRepo.addDeckRepo(req.body, CardList, req.token.buId, req.token.userId);
                    }
                }
            }

            if (deckAddResults > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.deckCreated })
                    ),
                });
            } else if (excelFieldFlag || data?.length == 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: responseMessage.excelErrorMessage })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: errorMessage.unhandled })
                    ),
                });


            }




        }
        ), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.createDeckService, userId: `${req.token.buId}`, operation: operation.post
    });
}


async function getAllDeckService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getAllDeckResponse = await deckRepo.getAllDeckRepo(req.token.buId);
            let finalResult;
            if (getAllDeckResponse?.length > 0) {
                finalResult = getAllDeckResponse.map(deckAllData => {
                    const data = new Deck({});
                    data.deckId = deckAllData.deck_id
                    data.deckName = deckAllData.name
                    data.deckImage = deckAllData.image_url
                    data.deckImageId = deckAllData.image_id
                    data.difficultyLevel = deckAllData.difficultylevel
                    data.cardCount = deckAllData.card_count
                    return data;
                })
            }

            if (finalResult?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: finalResult })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });

            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.getAllDeckService, userId: `${req.token.buId}`, operation: operation.get
    })


}

async function editGetAllDeckService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let getAllDeckResponse = await deckRepo.editGetAllDeckRepo(req.params?.sectionId ?? 0, req.token.buId);

            if (getAllDeckResponse?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: getAllDeckResponse })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }

        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.getAllDeckService, userId: `${req.token.buId}`, operation: operation.get
    })


}


async function getDeckandCardByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getDeckAndCardResponse;
            if (req?.params?.deckId) {
                getDeckAndCardResponse = await deckRepo.getByIdDeckAndCardRepo(req.params.deckId, req.token.buId);
            }
            const cardDataList = [];
            const data = new Deck({});
            if (getDeckAndCardResponse?.length > 0) {
                getDeckAndCardResponse.map((deck) => {
                    const cardData = new Card({});
                    deck[fieldName.options] = optionsList(deck);
                    data.buId = deck.bu_id
                    data.deckId = deck.deck_id
                    data.deckName = deck.name
                    data.difficultyLevel = deck.difficultylevel
                    data.visibility = deck.visibility
                    data.deckImage = deck.deck_image
                    data.deckImageId = deck.image_id
                    data.subject = deck.subject
                    data.topic = deck.topic
                    data.subTopic = deck.sub_topic
                    data.exam = deck.exam
                    data.standard = deck.standard
                    data.cardCount = deck.card_count
                    cardData.cardId = deck.card_id
                    cardData.question = deck.question
                    cardData.questionImage = deck.question_image
                    cardData.visibility = deck.card_visibility
                    cardData.questionType = deck.type
                    cardData.solution = deck.solution ?? ""
                    cardData.options = deck.options
                    cardData.hint = deck.hint ?? ""
                    cardData.hintImage = deck.hint_image
                    cardDataList.push(cardData)
                })
                data.cards = cardDataList;
                successResponse({
                    successCb: successCb,
                    data: data
                })
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }

        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.getDeckandCardByIdService, userId: `${req.token.buId}`, operation: operation.get
    })

}

async function getDeckByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let getDeckByIdResponse;
            if (req?.params?.deckId) {
                getDeckByIdResponse = await deckRepo.getByIdDeckRepo(req.params.deckId, req.token.buId);
            }
            let finalData;

            if (getDeckByIdResponse && getDeckByIdResponse.length > 0) {
                const data = new Deck({});
                data.buId = getDeckByIdResponse[0].bu_id
                data.deckId = getDeckByIdResponse[0].deck_id
                data.deckName = getDeckByIdResponse[0].name
                data.difficultyLevel = getDeckByIdResponse[0].difficultylevel
                data.deckImage = getDeckByIdResponse[0].image
                data.deckImageId = getDeckByIdResponse[0].image_id
                data.subject = getDeckByIdResponse[0].subject
                data.topic = getDeckByIdResponse[0].topic
                data.subTopic = getDeckByIdResponse[0].sub_topic
                data.exam = getDeckByIdResponse[0].exam
                data.standard = getDeckByIdResponse[0].standard
                finalData = data
            }

            if (finalData) {
                return successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: finalData })

                    )
                })

            } else {
                return successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ err: responseMessage.noDataFound })

                    )
                })
            }

        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.getDeckByIdService, userId: `${req.token.buId}`, operation: operation.get


    })
}

async function searchDeckService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let searchDeckResponse;
            if (req?.query?.deckName) {
                searchDeckResponse = await deckRepo.searchDeckRepo(req.query.deckName, req.token.buId);
            }
            if (searchDeckResponse && searchDeckResponse.length > 0) {
                successResponse({
                    successCb: successCb,
                    data: searchDeckResponse
                })
            }
            else {

                return successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ err: responseMessage.noDataFound })

                    )
                })

            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.searchDeckService, userId: `${req.token.buId}`, operation: operation.get
    })
}

async function updateDeckByIdService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) : commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {

                let updateResults = await deckRepo.updateDeckRepo(req.body, req.token.buId, req.token.userId);
                if (updateResults?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: responseMessage.deckUpdated })
                        ),
                    });
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.no_data_found }),
                            cr.bodyCb({ val: responseMessage.noDataFound })
                        ),
                    });
                }
            }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName, userId: `${req.token.userId}`, operation: operation.update
        });
}

async function updateDeckCoverImageByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let fileData = await fileUpload.fileUpload(req, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);

            let updateResponse;
            let imageUrl
            if (fileData?.header?.code == '600') {
                imageUrl = fileData?.body?.value?.image?.length > 0 ? fileData.body.value.image : ''
                updateResponse = await deckRepo.updateDeckCoverImageRepoById(req.body, imageUrl, req.token.buId, req.token.userId)
            }
            if (updateResponse > 0) {
                successCb({
                    data: cr.responseCb(

                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.deckCoverImageUpdated })
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



        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.updateDeckCoverImageByIdService, userId: req.token.buId, operation: operation.update
    })

}

async function updateDeckVisibilityByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let updateDeckVisibilityResponse = await deckRepo.updateDeckVisibilityRepoById(req.body, req.token.buId, req.token.userId);

            if (updateDeckVisibilityResponse > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.visibilityUpdated })
                    ),
                });
            }

            else {
                successResponse({
                    successCb: successCb,
                    data: updateDeckVisibilityResponse
                })
            }

        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.updateDeckVisibilityByIdService, userId: req.token.buId, operation: operation.update
    })
}

async function deleteDeckCoverImageByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let deleteImageResponse = await deckRepo.deleteCoverImageByIdRepo(req.query, req.token.buId, req.token.userId);
            let flag = false;
            if (deleteImageResponse && deleteImageResponse.rowCount > 0) {
                let s3ImageDeleteResponse = await fileUpload.deleteFile(deleteImageResponse.rows[0].image_url, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName);
                if (s3ImageDeleteResponse.header.code == 600) {
                    flag = true;
                }
            }
            if (flag) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: responseMessage.deckCoverImageDeleted })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.deleteCoverImageByIdRepo, operation: operation.delete, userId: req.token.userId
    })
}

async function getMyDeckService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {

            let myDeckData = await deckRepo.getMyDeckRepo(req.token.buId, req.token.userId);
            if (myDeckData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: myDeckData })
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
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.updateDeckVisibilityByIdService, userId: req.token.buId, operation: operation.update
    })
}

async function getTrendingService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let currentDate = new Date();
            let pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 30);
            currentDate.setDate(currentDate.getDate() + 1);
            let trendingData = await deckRepo.getTrendingRepo(req.token.buId, pastDate.toISOString().split('T')[0], currentDate.toISOString().split('T')[0], req.limit);
            if (trendingData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: trendingData })
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
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.getTrendingService, userId: req.token.buId, operation: operation.get
    })

}

async function deleteDeckByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let deleteDeckResponse;
            if (req?.params?.deckId) {
                deleteDeckResponse = await deckRepo.deleteAllDeckByIdRepo(req.params.deckId);
            }
            if (deleteDeckResponse === true) {
                successResponse({
                    successCb: successCb,
                    data: responseMessage.deckDeleted
                })
            } else if (deleteDeckResponse?.length == 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: responseMessage.lastDeck })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.no_data_found }),
                        cr.bodyCb({ val: responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName.deleteDeckByIdService, userId: req.token.buId, operation: operation.delete
    })
}


async function searchDeckByName(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) : commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let finalResult;
                if (req?.query?.deckName) {
                    let getDeckNameResponse = await deckRepo.searchDeckByNameRepo(req.query.deckName, req.token.buId)
                    finalResult = getDeckNameResponse?.map(deckAllData => {
                        const data = new Deck({});
                        data.deckId = deckAllData.deck_id
                        data.deckName = deckAllData.name
                        return data;
                    })
                }

                if (finalResult?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: finalResult })
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

            }), res: res, fileName: fileName.deckService, methodName: methodName.searchDeckByName, errorMessage: errorMessage, userId: `${req.token.buId}`, operation: operation.get
        })
}



async function trendingSearchDeckByName(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) : commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let getDeckNameResponse = await deckRepo.trendingSearchDeckByNameRepo(req.query.deckName, req.token.buId)
                if (getDeckNameResponse.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: getDeckNameResponse })
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
            }), res: res, fileName: fileName.deckService, methodName: methodName.searchDeckByName, errorMessage: errorMessage, userId: `${req.token.buId}`, operation: operation.get
        })
}

async function getAllDeckByName(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getDeckNameResponse;
            if (req?.params?.deckId) {
                getDeckNameResponse = await deckRepo.getAllDeckByNameRepo(req.params.deckId, req.token.buId)
            }
            const finalResult = getDeckNameResponse?.map(deckAllData => {
                const data = new Deck({});
                data.deckId = deckAllData.deck_id
                data.deckName = deckAllData.name
                data.deckImage = deckAllData.image_url
                data.deckImageId = deckAllData.image_id
                data.difficultyLevel = deckAllData.difficultylevel
                data.cardCount = deckAllData.card_count
                return data;
            })

            if (finalResult?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: response_code.success }),
                        cr.bodyCb({ val: finalResult })
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

        }), res: res, fileName: fileName.deckService, methodName: methodName.getAllDeckByName, errorMessage: errorMessage, userId: req.token.buId, operation: operation.get
    })
}

async function addImage(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            const data = await fileUpload.fileUpload(req, process.env.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : aws.bucketName)
            successCb({
                data: cr.responseCb(
                    cr.headerCb({ code: Object.keys(data?.body?.value).length > 0 ? data.header.code : response_code.no_data_found }),
                    cr.bodyCb({ val: Object.keys(data?.body?.value).length > 0 ? data?.body?.value : null })
                ),
            });
        }), res: res, errorMessage: errorMessage, fileName: fileName.deckService, methodName: methodName, userId: req.token.buId, operation: operation.delete
    })
}

async function getSearchDeckNameService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getDeckSectionrResult;
            let finalResult;
            getDeckSectionrResult = await deckRepo.getNameDeckRepo(req.query.sectionId, req.query.filterText, req.token.buId);
            if (getDeckSectionrResult) {
                finalResult = getDeckSectionrResult.map(result => {
                    const deck = new Deck({})
                    deck.deckId = result.deck_id
                    deck.deckName = result.name
                    return deck;
                });
                if (finalResult?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.success }),
                            cr.bodyCb({ val: finalResult })
                        ),
                    });
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: response_code.no_data_found }),
                            cr.bodyCb({ val: responseMessage.noDataFound })
                        ),
                    });
                }
            }
        }),
        res: res,
        errorMessage: errorMessage,
        fileName: fileName.deckService,
        methodName: methodName.getSearchDeckNameService,
        userId: `${req.token.buid}`,
        operation: operation.get
    });

}

module.exports = { trendingSearchDeckByName, getSearchDeckNameService, editGetAllDeckService, optionsList, addImage, getAllDeckByName, searchDeckByName, updateDeckByIdService, getMyDeckService, getTrendingService, updateDeckCoverImageByIdService, createDeckService, getAllDeckService, getDeckByIdService, getDeckandCardByIdService, deleteDeckByIdService, searchDeckService, updateDeckVisibilityByIdService, deleteDeckCoverImageByIdService }


