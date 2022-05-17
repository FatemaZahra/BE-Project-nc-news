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
        expect(body).toEqual({ msg: "Bad Request" });
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the article incremented by newVotes count", () => {
    const incrementObj = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/2")
      .send(incrementObj)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(10);
      });
  });
  test("200: Responds with the article decremented by newVotes count", () => {
    const decrementObj = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(decrementObj)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(90);
      });
  });
  test("400: Responds with a bad request when incorrect data type  is passed in the obj", () => {
    const incrementObj = { inc_votes: "increase_by_10" };
    return request(app)
      .patch("/api/articles/3")
      .send(incrementObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("400: Responds with a bad request when the required fields are missing", () => {
    const incrementObj = {};
    return request(app)
      .patch("/api/articles/3")
      .send(incrementObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
});
