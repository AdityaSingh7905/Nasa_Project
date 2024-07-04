const request = require("supertest");
const app = require("../../app");

const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test Get /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app).get("/v1/launches").expect(200);
      // expect(response).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "Kepler Exploration I",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
      launchDate: "January 9, 2030",
    };
    const launchDataWithoutDate = {
      mission: "Kepler Exploration I",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };
    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Missing required launch property!!",
      });
    });
    test("It should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "Kepler Exploration I",
          rocket: "Explorer IS1",
          target: "Kepler-442 b",
          launchDate: "Hello",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Invalid Date",
      });
    });
  });
});
