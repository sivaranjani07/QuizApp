const express = require('express');
const router = express.Router();
const sectionService = require('../service/section_service');
const sectionValidation = require('../service/section_validation');



router.post('/create', sectionValidation.sectionCreateValidation(), async (req, res) => {
    await sectionService.createSectionService(req, res);
})

router.put('/update', sectionValidation.updatesectionValidation(), async (req, res) => {
    await sectionService.updateSectionService(req, res);
})

router.get("/getAllSection", async (req, res) => {
    await sectionService.getAllSectionService(req, res);
})

router.get('/getById/:sectionId', async (req, res) => {
    await sectionService.getSectionByIdService(req, res);
})


router.delete('/deleteById/:sectionId', async (req, res) => {
    await sectionService.deleteSectionByIdService(req, res);
})

router.delete('/deleteDeck/:sectionId/:deckId', async (req, res) => {
    await sectionService.deleteSectionDeckService(req, res);
});

router.post('/addDeck', async (req, res) => {
    await sectionService.addSectionDecksService(req, res);
})

router.get('/searchDecks', async (req, res) => {
    await sectionService.getDeckBySection(req, res);
})

router.get('/all/searchDecks', sectionValidation.sectionSearchValidation(), async (req, res) => {
    await sectionService.getSectionDeckBySection(req, res);
})

router.get('/home', async (req, res) => {
    await sectionService.getSectionsService(req, res);
})

router.get('/all/:id', async (req, res) => {
    await sectionService.getSectionDecksService(req, res);
})

router.put('/toggle', async (req, res) => {
    await sectionService.toggleSectionService(req, res);
})


module.exports = router;
