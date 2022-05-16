process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("/api/topics", () => {
  test("200: Returns an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "<<<body");
        const { topics } = body;
        expect(body).toBeInstanceOf(Object);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: Path not found", () => {
    return request(app)
      .get("/api/something")
      .expect(404)
      .then((response) => {
        response.body = { msg: "Path not found" };
      });
  });
});
