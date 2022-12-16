const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const usersService = require("../api/users/users.service");
const articlesSchema = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";

  const MOCK_DATA_ARTICLES = [
    {
      _id: USER_ID,
      title: "test",
      content: "test@test.net",
    },
  ];

  const MOCK_DATA_CREATED_ARTICLES = {
    title: "test",
    content: "test@test.net",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(articlesSchema).toReturn(MOCK_DATA_ARTICLES, "find");
    mockingoose(articlesSchema).toReturn(MOCK_DATA_CREATED_ARTICLES, "save");
  });

  test("[Articles] Get Article of a User", async () => {
    const res = await request(app)
      .get("/api/users/:userId/articles")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });


  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED_ARTICLES)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED_ARTICLES.title);
  });

  test("Est-ce userService.getAllUserArticle", async () => {
    const spy = jest
      .spyOn(usersService, "getAllUserArticle")
      .mockImplementation(() => "test");
    await request(app).get("/api/users/:userId/articles").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
