const commonHandleFunction = require('../common/common_handle_response')
const { errorMessage, responseMessage, fileName, methodName, operation } = require('../config/app_config.json')
const cr = require('../common/common_response');
const config_app = require('../config/app_config.json')
const { successResponse } = require('./common_service')
const sectionRepo = require('../repo/section_repo');
const { Section } = require('../entity/section_entity');
const { Deck } = require('../entity/deck_entity');
const { validationResult } = require('express-validator');



async function createSectionService(req, res) {
    const { token, body } = req;
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: async (successCb) => {
                if (req.body?.deckIdList?.length > 0) {
                    const getusersection = await sectionRepo.getUserSectionRepo(token);

                    if (getusersection < 5) {
                        const addSectionResults = await sectionRepo.addSectionRepo(body, token);
                        if (addSectionResults?.length > 0) {
                            successCb({
                                data: cr.responseCb(
                                    cr.headerCb({ code: config_app.response_code.success }),
                                    cr.bodyCb({ val: config_app.responseMessage.sectionCreated })
                                ),
                            });
                        } else {
                            successCb({
                                data: cr.responseCb(
                                    cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                                    cr.bodyCb({ val: config_app.responseMessage.unhandled })
                                ),
                            });
                        }
                    } else {
                        successCb({
                            data: cr.responseCb(
                                cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                                cr.bodyCb({ val: config_app.responseMessage.sectionCreationLimitReached })
                            ),
                        });
                    }
                }
                else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                            cr.bodyCb({ val: config_app.errorMessage.emptySectionCreate })
                        ),
                    });
                }
            }, res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.createSectionService, userId: req.token.buId, operation: operation.post,
        });
}


async function updateSectionService(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) :
        commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let updateSectionResults;
                if (req.body) {
                    updateSectionResults = await sectionRepo.updateSectionRepo(req.body, req.token);
                }
                if (updateSectionResults?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.success }),
                            cr.bodyCb({ val: config_app.responseMessage.sectionUpdated })
                        ),
                    });
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                            cr.bodyCb({ val: config_app.responseMessage.unhandled })
                        ),
                    });
                }

            }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.updateSectionService, userId: `${req.token.userId}`, operation: operation.post
        });
}


async function getAllSectionService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getAllSectionResults;
            if (req.token) {
                getAllSectionResults = await sectionRepo.getAllSectionRepo(req.token);

            }
            let finalResult;
            if (getAllSectionResults?.length > 0) {
                finalResult = getAllSectionResults.map(result => {
                    const section = new Section({});
                    section.sectionId = result.section_id;
                    section.sectionName = result.section_name;
                    section.deckCount = result.deck_count;
                    return section;
                });
            }

            if (finalResult?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: finalResult })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }),
        res: res,
        errorMessage: errorMessage,
        fileName: fileName.sectionService,
        methodName: methodName.getAllSectionService,
        userId: `${req.token.userId}`,
        operation: operation.get
    });
}

async function getSectionByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let sectionDataList;
            let groupedData = {};
            if (req.params?.sectionId) {
                sectionDataList = await sectionRepo.getSectionByIdRepo(req.params.sectionId, req.token);



                sectionDataList?.forEach(row => {
                    if (!(row.section_id in groupedData)) {
                        groupedData[row.section_id] = {
                            sectionId: row.section_id,
                            sectionName: row.section_name,
                            visibility: row.visibility,
                            deck_details: []
                        };
                    }

                    if (row.deck_id !== null && row.deck_name !== null && row.card_count !== null) {
                        const deck = new Deck({})
                        deck.deckId = row.deck_id,
                            deck.deckName = row.deck_name,
                            deck.cardCount = row.card_count,
                            deck.difficultyLevel = row.difficultylevel
                        deck.deckImage = row.deckimage,

                            groupedData[row.section_id].deck_details.push(deck);
                    }
                });

            }
            let result = Object.values(groupedData);

            if (result?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: result[0] })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }, res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.getSectionByIdService, userId: `${req.token.userId}`, operation: operation.get
    });
}



async function deleteSectionByIdService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let deleteSectionResponse;
            if (req.params?.sectionId) {
                deleteSectionResponse = await sectionRepo.deleteSectionByIdRepo(req.params.sectionId, req.token);
            }
            if (deleteSectionResponse) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: config_app.responseMessage.sectionDeleted })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.deleteSectionByIdService, userId: `${req.token.buId}`, operation: operation.delete
    });
}

async function deleteSectionDeckService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {

            const deleteSectionDeckResult = await sectionRepo.deleteSectionDeckRepo(req.params, req.token);

            if (deleteSectionDeckResult) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: config_app.responseMessage.sectionUpdated })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: config_app.responseMessage.sectionLastDeck })
                    ),
                });
            }
        }, res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.createDeckService, userId: `${req.token.buId}`, operation: operation.put,
    });
}

async function addSectionDecksService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let addSectionDeckResponse = await sectionRepo.addSectionDecksRepo(req.body, req.token);
            if (addSectionDeckResponse?.length > 0) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: config_app.responseMessage.sectionUpdated })
                    ),
                });
            } else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.error_dbissue_serverissue }),
                        cr.bodyCb({ val: config_app.responseMessage.unhandled })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.addSectionDecksService, userId: `${req.token.buId}`, operation: operation.post
    });
}

async function getDeckBySection(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let getDeckSectionrResult;
            let finalResult;
            getDeckSectionrResult = await sectionRepo.getDeckBySectionRepo(req.query.sectionId, req.query.filterText, req.token);
            if (getDeckSectionrResult) {
                finalResult = getDeckSectionrResult.map(result => {
                    const deck = new Deck({})
                    deck.deckId = result.deck_id,
                        deck.deckName = result.deck_name
                    return deck;
                });
                if (finalResult?.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.success }),
                            cr.bodyCb({ val: finalResult })
                        ),
                    });
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.no_data_found }),
                            cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                        ),
                    });
                }
            }
        }),
        res: res,
        errorMessage: errorMessage,
        fileName: fileName.sectionService,
        methodName: methodName.getDeckBySection,
        userId: `${req.token.buid}`,
        operation: operation.post
    });
}

async function getSectionDeckBySection(req, res) {
    const validationError = validationResult(req)
    return !validationError.isEmpty() ?
        commonHandleFunction.fieldValidationResponse(res, validationError) : commonHandleFunction.handleCommonResponse({
            successCb: (async (successCb) => {
                let getDeckSectionrResult = req.query?.sectionId ? await sectionRepo.getSectionDeckBySectionRepo(req.query.sectionId, req.query.filterText, req.token) : [];
                if (getDeckSectionrResult.length > 0) {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.success }),
                            cr.bodyCb({ val: getDeckSectionrResult })
                        ),
                    });
                } else {
                    successCb({
                        data: cr.responseCb(
                            cr.headerCb({ code: config_app.response_code.no_data_found }),
                            cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                        ),
                    });
                }

            }),
            res: res,
            errorMessage: errorMessage,
            fileName: fileName.sectionService,
            methodName: methodName.getSectionDeckBySection,
            userId: `${req.token.buid}`,
            operation: operation.post
        });
}


async function getSectionsService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let sectionData = await sectionRepo.getSectionsRepo(req.token);
            if (sectionData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: sectionData })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.getSectionsService, userId: `${req.token.userId}`, operation: operation.get
    })
}

async function getSectionDecksService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let sectionData = req?.params?.id ? await sectionRepo.getSectionsDeckRepo(req.params.id) : false;

            if (sectionData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: sectionData })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.getSectionDecksService, userId: `${req.token.userId}`, operation: operation.get
    })
}


async function toggleSectionService(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: (async (successCb) => {
            let sectionData = await sectionRepo.toggleSectionRepo(req.body);

            if (sectionData) {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.success }),
                        cr.bodyCb({ val: responseMessage.sectionUpdated })
                    ),
                });
            }
            else {
                successCb({
                    data: cr.responseCb(
                        cr.headerCb({ code: config_app.response_code.no_data_found }),
                        cr.bodyCb({ val: config_app.responseMessage.noDataFound })
                    ),
                });
            }
        }), res: res, errorMessage: errorMessage, fileName: fileName.sectionService, methodName: methodName.getSectionDecksService, userId: `${req.token.userId}`, operation: operation.get
    })
}

module.exports = { getSectionDeckBySection, toggleSectionService, getSectionDecksService, getSectionsService, createSectionService, updateSectionService, getAllSectionService, getSectionByIdService, deleteSectionByIdService, deleteSectionDeckService, addSectionDecksService, getDeckBySection }
