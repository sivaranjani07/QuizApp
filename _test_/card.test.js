let request = require('supertest');
const app = require('../app');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGV0YWlsIjp7InVzZXJJZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6Imthbm5hcGFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiS2FubmFwYW4iLCJ1c2VyU3RhdHVzIjp0cnVlLCJidUlkIjoxfSwiaWF0IjoxNjg4NDYzMjMxLCJleHAiOjE2ODkzMjcyMzF9.lLkipJ75zCh-m59PKAYvQV6Her8yIi3mpFtomzgzLEE";


describe("card rest end points", () => {
    describe("creating a card", () => {
        test("creating a card by giving all necessary fields", async () => {
            const response = await request(app)
                .post("/card/create")
                .set('Authorization', `Bearer ${token}`)
                .field("question", 'test question')
                .field("solution", 'test answer')
                .field("option1", 'test option1')
                .field("option2", 'test option2')
                .field("option3", 'test option3')
                .field("hint", 'test hint')
                .field("deckId", 11)
                .field("questionType", 'MCQ');
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(600);

        })
        test("expects field validation error by missing some fields", async () => {
            const response = await request(app)
                .post("/card/create")
                .set('Authorization', `Bearer ${token}`)
                .field("solution", 'test answer')
                .field("option1", 'test option1')
                .field("option2", 'test option2')
                .field("option3", 'test option3')
                .field("hint", 'test hint')
                .field("deckId", 11)
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(601);

        })
    })

    describe("updating a card", () => {
        const updateData = {
            question: "card is updated card",
            solution: "updated solution",
            option1: "Tiger",
            option2: "Lion",
            option3: "cheeta",
            option4: "rfg",
            option5: "ftgyj",
            cardId: 40,
            deckId: 11
        }
        test("updated successfully by giving all field correctly", async () => {
            const response = await request(app)
                .put("/card/update")
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(600);
        })

        test("expects field validation error by missing some fields", async () => {
            delete updateData.question
            const response = await request(app)
                .put("/card/update")
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(601);
        })
    })

    describe("deleteimages in card", () => {
        const deletedata = {
            cardId: 36,
            type: "questionImage",
            imageId: 6
        }
        test('testing card positive response', async () => {
            const response = await request(app)
                .delete("/card/deleteImage")
                .set('Authorization', `Bearer ${token}`)
                .send(deletedata)
            expect(JSON.parse(response.text).header.code).toBe(600);
        })

        test('expects field validation error by missing some fields', async () => {
            delete deletedata.type;
            const response = await request(app)
                .delete("/card/deleteImage")
                .set('Authorization', `Bearer ${token}`)
                .send(deletedata)
            expect(JSON.parse(response.text).header.code).toBe(601);
        })
    })

    describe("getting all cards in a deck", () => {
        test("expects success", async () => {
            const response = await request(app)
                .get(`/card/getByIdlist/11`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
        test("expects nodata when deck has no cards", async () => {
            const response = await request(app)
                .get(`/card/getByIdlist/10`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    })

    describe("get card by its id", () => {
        test("expects success", async () => {
            const response = await request(app)
                .get(`/card/getById/36`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
        test("empty response when there is no cards with that id", async () => {
            const response = await request(app)
                .get(`/card/getById/3`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    })

    describe("card visibility update", () => {
        const carddata = {
            "deckId": 11,
            "cardId": 36,
            "visibility": true
        }

        test("updated successfully by giving all field correctly", async () => {
            const response = await request(app)
                .put("/card/toggleVisibility")
                .set('Authorization', `Bearer ${token}`)
                .send(carddata);
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(600);
        })

        test("expects field validation error by missing some fields", async () => {
            delete carddata.visibility
            const response = await request(app)
                .put("/card/toggleVisibility")
                .set('Authorization', `Bearer ${token}`)
                .send(carddata);
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(601);
        })
    })

    describe("delete a card by its id", () => {
        test('testing card positive response', async () => {
            const response = await request(app)
                .delete("/card/delete/56")
                .set('Authorization', `Bearer ${token}`)
                .send(deletedata)
            expect(JSON.parse(response.text).header.code).toBe(600);
        })

        test('expects empty response by giving non existing cardId', async () => {
            delete deletedata.type;
            const response = await request(app)
                .delete("/card/delete/555")
                .set('Authorization', `Bearer ${token}`)
                .send(deletedata)
            expect(JSON.parse(response.text).header.code).toBe(607);
        })
    })

    describe("post the user favourite card in database", () => {
        test('testing card positive response', async () => {
            const response = await request(app)
                .post("/card/favourite/40")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    describe("post the user revise card in database", () => {
        test('testing card positive response', async () => {
            const response = await request(app)
                .post("/card/revise/36")
                .set('Authorization', `Bearer ${token}`);

            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
    describe("delete the user revise card from database ", () => {
        test('testing card positive response', async () => {
            const response = await request(app)
                .put("/card/revise/36")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
    describe("delete the user favourite card fro database ", () => {
        test('testing card positive response', async () => {
            const response = await request(app)
                .put("/card/favourite/40")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
});