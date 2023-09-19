const express = require('express');
const router = express.Router();
const cardService = require('../service/card_service');
const fileUpload = require('../common/fileupload');
const cardValidation = require('../service/card_validation')


router.post('/create', fileUpload.multipleupload({ "fileNames": ['questionImage', 'hintImage', 'option1Image', 'option2Image', 'option3Image', 'option4Image', 'option5Image'] }), cardValidation.cardCreateValidation(), async (req, res) => {
    await cardService.createCardService(req, res);
});





router.put('/update',cardValidation.cardUpdateValidation(), async (req, res) => {
    await cardService.updateCardByIdService(req, res);
});


router.delete('/deleteImage',cardValidation.deleteImageValidation(), async (req, res) => {
    await cardService.deleteCardImageService(req, res);
});

router.put('/updateImage', fileUpload.singleupload({ file: "image" }), async (req, res) => {
    await cardService.updateCardImageService(req, res);
});

router.get('/getById/:cardId', async (req, res) => {
    await cardService.getCardByIdService(req, res);
});


router.put('/toggleVisibility',cardValidation.cardVisibilityUpdateValidation(), async (req, res) => {
    await cardService.updateCardVisibilityService(req, res);
});

router.get('/getByIdlist/:deckId', async (req, res) => {
    await cardService.getCardByIdListService(req, res);
});

router.delete('/delete', async (req, res) => {
    await cardService.deleteCardByIdService(req, res)
})

router.post('/favourite', async (req, res) => {
    await cardService.addFavouriteService(req, res)
})

router.post('/revise', async (req, res) => {
    await cardService.addReviseService(req, res)
})


router.put('/revise', async (req, res) => {
    await cardService.deleteReviseService(req, res)
})






module.exports = router;