process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const sorted = require("jest-sorted");

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
  test("200:Responds with an article object which has the key of comment count", () => {
    const article_id = 5;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(2);
      });
  });
  test("200:Responds with an article object with comment count as 0 when the article has 0 comments", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(0);
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
        expect(body).toEqual({ msg: "Missing required fields" });
      });
  });
  test("404: Not-found, ID doesn't exist", () => {
    const id = 9999999;
    const incrementObj = { inc_votes: 10 };
    return request(app)
      .patch(`/api/articles/${id}`)
      .send(incrementObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `Article with ${id} ID doesn't exist`,
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Returns an array of objects with the property username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user.name).toBeUndefined();
          expect(user.avatar_url).toBeUndefined();
          expect(user).toMatchObject({
            username: expect.any(String),
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
describe("GET /api/articles", () => {
  test("200:Returns an array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
  test("200:Returns an array of article objects sorted by any valid column", () => {
    const toSortBy = "comment_count";
    return request(app)
      .get(`/api/articles?sort_by=${toSortBy}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSorted("comment_count", {
          descending: true,
        });
      });
  });
  test("400: Returns a bad request when passed an invalid column to sort_by", () => {
    const toSortBy = 1;
    return request(app)
      .get(`/api/articles?sort_by=${toSortBy}`)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid data" });
      });
  });
  test("200: Returns an array of article objects sorted in ascending or descending order", () => {
    const orderBy = "ASC";
    return request(app)
      .get(`/api/articles?order=${orderBy}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSorted({ key: "created_at" });
      });
  });
  test("400: Returns a bad request when passed any value except asc or desc", () => {
    const orderBy = 1;
    return request(app)
      .get(`/api/articles?order=${orderBy}`)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid data" });
      });
  });
  test("200: Returns an array of article objects filtered by the topic value specified in the query", () => {
    const givenTopic = "cats";
    return request(app)
      .get(`/api/articles?topic=${givenTopic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeInstanceOf(Array);
        const articleOnTopic = articles.every(
          (article) => article.topic == "cats"
        );
        expect(articleOnTopic).toBe(true);
      });
  });
  test("200: Returns an empty array when topic is valid but has no related articles yet", () => {
    const givenTopic = "paper";
    return request(app)
      .get(`/api/articles?topic=${givenTopic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
  test("404: Returns topic not found when passed an invalid topic", () => {
    const givenTopic = "hellloooo";
    return request(app)
      .get(`/api/articles?topic=${givenTopic}`)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Topic not found" });
      });
  });
  test("200: Returns an array of objects filtered by topic in sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        const articleOnTopic = articles.every(
          (article) => article.topic == "mitch"
        );
        expect(articleOnTopic).toBe(true);
        expect(articles).toBeSorted({ key: "title" });
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article ID with mentioned properties", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test("200:Responds with an empty array when article ID has 0 comments", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
  test("400: End-point with invalid data type", () => {
    return request(app)
      .get("/api/articles/I_am_an_article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("404: Not-found, ID doesn't exist", () => {
    const article_id = 9999999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `Article ID:${article_id} ID doesn't exist`,
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment that has username and body as its property", () => {
    const newComment = {
      username: "butter_bridge",
      body: "That's a lovely article",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          author: "butter_bridge",
          article_id: 3,
          votes: 0,
          created_at: expect.any(String),
          body: "That's a lovely article",
        });
      });
  });
  test("400: End-point with invalid data type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "That's a lovely article",
    };
    return request(app)
      .post("/api/articles/I_am_an_article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("400: Responds with a bad request when the required fields are missing", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Missing required fields" });
      });
  });

  test("400: Responds with a bad request when incorrect data type is passed in the obj", () => {
    const newComment = {
      username: 1,
      body: 100,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid type of values" });
      });
  });
  test("404:Responds with a bad request when username doesn't exist", () => {
    const newComment = {
      username: "Fatema",
      body: "That's a lovely article",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Username not found" });
      });
  });
  test("404: ID doesn't exist-PSQL error", () => {
    const article_id = 9999999;
    const newComment = {
      username: "butter_bridge",
      body: "That's a lovely article",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `Article ID:${article_id} ID doesn't exist`,
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204:Deletes the given comment by mentioned comment id", () => {
    const comment_id = 2;
    return request(app).delete(`/api/comments/${comment_id}`).expect(204);
  });
  test("400: End-point with invalid data type", () => {
    return request(app)
      .delete(`/api/comments/iAmAComment`)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("404: Not-found, ID doesn't exist", () => {
    const comment_id = 9999999;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `Comment ID:${comment_id} doesn't exist`,
        });
      });
  });
});
