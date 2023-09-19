let request = require('supertest');
const app = require('../app');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGV0YWlsIjp7InVzZXJJZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6Imthbm5hcGFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiS2FubmFwYW4iLCJ1c2VyU3RhdHVzIjp0cnVlLCJidUlkIjoxfSwiaWF0IjoxNjg4NDYzMjMxLCJleHAiOjE2ODkzMjcyMzF9.lLkipJ75zCh-m59PKAYvQV6Her8yIi3mpFtomzgzLEE";

const createSectionUrl = `/section/create`
const updateSectionUrl = `/section/update`

describe("section rest end points", () => {
    describe("get the  section from database", () => {
        test('testing section positive response', async () => {
            const response = await request(app)
                .get("/section/home")
                .set('Authorization', `Bearer ${token}`);
            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    describe("get the  section from database based on sectionId", () => {
        test('testing section positive response', async () => {
            const response = await request(app)
                .get("/section/all/7")
                .set('Authorization', `Bearer ${token}`);

            expect(JSON.parse(response.text).header.code).toBe(600);
        })
    })

    describe("creating a section", () => {
        const createData = {
            "sectionName": "testsection",
            "deckIdList": [12, 11]
        }
        test('creating a section by giving all necessary fields', async () => {
            const response = await request(app).post(createSectionUrl).set("Authorization", `Bearer ${token}`).send(createData)
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(600);

        })
        test("expects validation error for not giving sectionName", async () => {
            const finaldata = Object.assign({}, createData);
            delete finaldata["sectionName"];
            const response = await request(app)
                .post(createSectionUrl)
                .set("Authorization", `Bearer ${token}`)
                .send(finaldata);
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(601);
        });
        test("expects database error by giving non-existing deckIds", async () => {
            const finaldata = Object.assign({}, createData);
            finaldata["deckIdList"] = [1111];
            const response = await request(app)
                .post(createSectionUrl)
                .set("Authorization", `Bearer ${token}`)
                .send(finaldata)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(602);
        });
        test("expects maximum limit reached error when one bu creating more than 5 sections", async () => {
            const finaldata = Object.assign({}, createData);
            const response = await request(app)
                .post(createSectionUrl)
                .set("Authorization", `Bearer ${token}`)
                .send(finaldata)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(602);
        });
    })

    describe("updating a section", () => {
        const updateData = {
            "sectionId": 13,
            "sectionName": "Learnerr"
        }
        test('updating a section by giving all necessary fields', async () => {
            const response = await request(app).put(updateSectionUrl).set("Authorization", `Bearer ${token}`).send(updateData)
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()
            expect(JSON.parse(response.text).header.code).toBe(600);

        })
        test("expects validation error for not giving sectionId", async () => {
            const finaldata = Object.assign({}, updateData);
            delete finaldata["sectionId"];
            const response = await request(app)
                .put(updateSectionUrl)
                .set("Authorization", `Bearer ${token}`)
                .send(finaldata);
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(601);
        });
        test("expects database error by giving sectionId that is not exist in db", async () => {
            const finaldata = Object.assign({}, updateData);
            finaldata["sectionId"] = 666;
            const response = await request(app)
                .put(updateSectionUrl)
                .set("Authorization", `Bearer ${token}`)
                .send(finaldata);
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(602);
        });
    })

    describe("getting all section", () => {
        test("expects success", async () => {
            const response = await request(app)
                .get(`/section/getAllSection`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
        test("expects empty response if bu has no section", async () => {
            const emptybuToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGV0YWlsIjp7InVzZXJJZCI6MSwicm9sZSI6InVzZXIiLCJlbWFpbCI6Imthbm5hcGFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiS2FubmFwYW4iLCJ1c2VyU3RhdHVzIjp0cnVlLCJidUlkIjo0fSwiaWF0IjoxNjg4NDQ4MzAxLCJleHAiOjE2OTEwNDAzMDF9.o0FbmWI3ivRb-sCKIpe-9mj92E8mGbi2jbm-akW_-FI`
            const response = await request(app)
                .get(`/section/getAllSection`)
                .set("Authorization", `Bearer ${emptybuToken}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    })

    describe("getting section by sectionId", () => {
        test("expects success response by giving sectionid", async () => {
            const response = await request()
                .get(`/section/getById/13`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
        test("expects empty response by giving sectionid not existing", async () => {
            const response = await request()
                .get(`/section/getById/555`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    })
    
    describe("delete section by its Id", () => {
        test("expects succes by giving sectionid correctly", async () => {
            const response = await request(app)
                .delete(`/section/deleteById/47`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
        test("expects empty response by giving sectionid not existing", async () => {
    
            const response = await request(app)
                .delete(`/section/deleteById/0`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    });
    
    describe("delete a deck in a section", () => {
        test("expects success by giving sectionid and deckid", async () => {
    
            const response = await request(app)
                .delete(`/section/deleteDeckimage/50/12`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
        test("expects  by giving sectionid and deckid", async () => {
    
            const response = await request(app)
                .delete(`/section/deleteDeckimage/777/11`)
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(607);
        });
    })

    describe("adding a deck to a section", () => {
        const reqbody = {
            "sectionId":13,
            "deckIdList":[12]
        }
        test("expects success by giving sectionid and deckid", async () => {
    
            const response = await request(app)
                .post(`/section/addDeck`)
                .set("Authorization", `Bearer ${token}`)
                .send(reqbody)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });
    })

    describe("searchDecks in a section",()=>{
        const reqbody = {
            "sectionId":51,
            "filterText":"Eng"
        }
        test("expects success response by giving ", async () => {
            const response = await request()
                .post(`/section/searchDecks`)
                .set("Authorization", `Bearer ${token}`)
                .send(reqbody)
            expect(response.status).toBe(200);
            expect(JSON.parse(response.text).header.code).toBe(600);
        });

    })
});