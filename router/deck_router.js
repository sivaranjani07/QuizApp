const express = require('express');
const router = express.Router();
const deckService = require('../service/deck_service')
const fileUpload = require('../common/fileupload')
const validation = require('../service/deck_validation')
const config = require('../config/app_config.json')
// ,validation.deckCreateValidation()

router.post('/create', fileUpload.multipleupload({ "fileNames": ['file', 'image'] }), async (req, res) => {
    await deckService.createDeckService(req, res);
})

//c
router.get('/getById/:deckId', deckService.getDeckByIdService)

//c
router.get('/getDeckCardById/:deckId', async (req, res) => {
    await deckService.getDeckandCardByIdService(req, res);
})

//c
router.get('/getByName/:deckId', async (req, res) => {
    await deckService.getAllDeckByName(req, res)
})


//c
router.get('/getAll', async (req, res) => {
    await deckService.getAllDeckService(req, res);
})

router.get('/edit/getAll/:sectionId', async (req, res) => {
    await deckService.editGetAllDeckService(req, res);
})

//c
router.put('/update', validation.deckUpdateteValidation(), async (req, res) => {
    await deckService.updateDeckByIdService(req, res);
})

//
router.put('/updateCoverImage', fileUpload.singleupload({ file: "image" }), async (req, res) => {
    await deckService.updateDeckCoverImageByIdService(req, res)
})

router.delete('/deleteById/:deckId', async (req, res) => {
    await deckService.deleteDeckByIdService(req, res)
})


//c
router.delete('/deleteCoverImage', async (req, res) => {
    await deckService.deleteDeckCoverImageByIdService(req, res)
})

//c
router.put('/VisibiltyById', async (req, res) => {
    await deckService.updateDeckVisibilityByIdService(req, res)
});



router.get('/myDeck', async (req, res) => {
    await deckService.getMyDeckService(req, res)
})

router.get('/trending/home', async (req, res) => {
    req.limit = config.limit.home;
    await deckService.getTrendingService(req, res)
})

router.get('/trending/all', async (req, res) => {
    req.limit = config.limit.all;
    await deckService.getTrendingService(req, res)
})
router.get('/trending/searchByName', validation.deckSearchValidation(), async (req, res) => {
    await deckService.trendingSearchDeckByName(req, res)
})
router.post('/image', fileUpload.singleupload({ file: 'image' }), async (req, res) => {
    await deckService.addImage(req, res)
})

//c
router.get('/searchByName', async (req, res) => {
    await deckService.searchDeckByName(req, res)
})


router.get('/searchDecks', deckService.getSearchDeckNameService)

module.exports = router