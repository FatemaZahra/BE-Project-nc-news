process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const { convertTimestampToDate } = require("../db/helpers/utils.js");

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
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);
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
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object with the required properties.", () => {
    const article_id = 5;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "<<<body");
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 5,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("400: End-point with invalid data type", () => {
    return request(app)
      .get("/api/articles/I_am_an_article")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid ID" });
      });
  });
  test("404: Not-found, ID doesn't exist", () => {
    const id = 9999999;
    return request(app)
      .get(`/api/articles/${id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `Article with ${id} ID doesn't exist`,
        });
      });
  });
});
