const express = require('express');
const router = express.Router();
const userService = require('../service/users_service')



// route for get users
router.post("/result", async (req, res) => {
    await userService.addUserResult(req, res)
}) 


router.get("/result/:deckId", async (req, res) => {
    await userService.getUserResult(req, res)
}) 

router.get("/cards/:type", async (req, res) => {
    await userService.getFavoriteAndReviseResult(req, res)
}) 





module.exports = router;
