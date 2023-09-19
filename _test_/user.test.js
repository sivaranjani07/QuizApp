let request = require('supertest');
const app = require('../app');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGV0YWlsIjp7InVzZXJJZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6Imthbm5hcGFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiS2FubmFwYW4iLCJ1c2VyU3RhdHVzIjp0cnVlLCJidUlkIjoxfSwiaWF0IjoxNjg4NDc0NzY2LCJleHAiOjE2ODg0NzgzNjZ9.PuOn3jJVYa327v79aUnuiQSZ2_TOCnCyJaHMOWGt7RQ";



const requestBody = {
    "deckId": "1",
    "score": "50",
    "correctAnswer": "22",
    "usingHint": "5",
    "withoutUsingHint": "6",
    "incorrectAnswer": "8",
    "unAnswered": "5"
}

describe("user rest end points", () => {
    // describe("post the user result in database", () => {
    //     test('testing user positive response', async () => {
    //         const response = await request(app)
    //             .post("/user/result")
    //             .set('Authorization', `Bearer ${token}`)
    //             .send(requestBody);
    //         expect(JSON.parse(response.text).header.code).toBe(600);
    //     })
    // })

    describe("get the user result from database", () => {
        test('testing user positive response', async () => {
            const response = await request(app)
                .get("/user/result/1")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
    describe("get the user revise user fro database ", () => {
        test('testing user positive response', async () => {
            const response = await request(app)
                .get("/user/cards/Revise")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
    describe("delete the user favourite user fro database ", () => {
        test('testing user positive response', async () => {
            const response = await request(app)
                .get("/user/cards/Favorite")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })
});