let request = require('supertest');
const app = require('../app');
let deckId = 13

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGV0YWlsIjp7InVzZXJJZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6Imthbm5hcGFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiS2FubmFwYW4iLCJ1c2VyU3RhdHVzIjp0cnVlLCJidUlkIjoxfSwiaWF0IjoxNjg4NTUxNTI4LCJleHAiOjE2ODg1NTUxMjh9.1S-Vu8uOC2SvlbFo_6dsfPa7WJ-0oQAKGC0JOZF7VSI";

var updateRequestbody = {
    "deckName": "English",
    "difficultyleve;": "Medium",
    "subject": "English",
    "topic": "Grammar",
    "subTopic": "Verb",
    "deckId": 11
}

var deleteCoverImageRequestBody = {
    "deckId": 11,
    "image_id": 22
}

var deckVisibilityRequestBody = {
    "deckId": 11,
    "visibility": false
}

describe("deck rest end points", () => {
    describe("getAll the Admin decks for home screen", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .get("/deck/getAll")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })


    describe("get the Admin decks by Id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .get(`/deck/getById/11`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })



    describe("get the Admin decks by Id", () => {
        test('testing deck Negative response', async () => {
            const response = await request(app)
                .get(`/deck/getById/1`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(607);
        })
    })

    //getdeckandcard by id
    describe("get the Admin decks and card by deckId", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .get(`/deck/getDeckCardById/11`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    //search
    describe("get the Admin decks by Id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .get(`/deck/searchByName?deckName=e`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    //getByname /update
    describe("get the Admin decks by Id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .get(`/deck/getByName/English`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    //update deck
    describe("update the deck by id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .put(`/deck/update`).send(updateRequestbody)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    // deleteCoverImage
    describe("delete deck cover image the deck by id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .delete(`/deck/deleteCoverImage`).send(deleteCoverImageRequestBody)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    ///VisibiltyById
    describe("update visibility by id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .put(`/deck/VisibiltyById`).send(deckVisibilityRequestBody)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    //deleteDeck

    describe("delete deck by id", () => {
        test('testing deck positive response', async () => {
            const response = await request(app)
                .delete(`/deck/deleteById/13`)
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    // describe("get the user decks for home screen", () => {
    //     test('testing deck positive response', async () => {
    //         const response = await request(app)
    //             .get("/deck/trending/home")
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(JSON.parse(response.text).header.code).toBe(600);
    //     })
    // })

    // describe("get the user all decks for home screen", () => {
    //     test('testing deck positive response', async () => {
    //         const response = await request(app)
    //             .get("/deck/trending/all")
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(JSON.parse(response.text).header.code).toBe(600);
    //     })
    // })
    // describe("get the user decks for myDecks ", () => {
    //     test('testing deck positive response', async () => {
    //         const response = await request(app)
    //             .get("/deck/myDeck")
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(JSON.parse(response.text).header.code).toBe(600);
    //     })
    // })
});