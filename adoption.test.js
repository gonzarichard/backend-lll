import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Adoption from "../models/Adoption.js";

describe("Functional Tests - Adoption Router", function () {
  this.timeout(10000);

  let user;
  let pet;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoURI =
        process.env.NODE_ENV === "production"
          ? process.env.MONGODB_URI_ATLAS
          : process.env.MONGODB_URI_LOCAL;

      await mongoose.connect(mongoURI);
    }

    await Adoption.deleteMany({});
    await Pet.deleteMany({});
    await User.deleteMany({});

    user = await User.create({
      first_name: "Test",
      last_name: "User",
      email: `test-${Date.now()}@test.com`,
      password: "123456",
      role: "user",
      pets: [],
    });

    pet = await Pet.create({
      name: "Test Pet",
      specie: "dog",
      adopted: false,
    });
  });

  after(async () => {
    await Adoption.deleteMany({});
    await Pet.deleteMany({});
    await User.deleteMany({});

    await mongoose.connection.close();
  });

  describe("GET /api/adoptions", () => {
    it("Debe obtener todas las adopciones", async () => {
      const response = await request(app)
        .get("/api/adoptions")
        .expect(200);

      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
    });
  });

  describe("GET /api/adoptions/:aid", () => {
    it("Debe devolver 404 si la adopción no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("Adoption not found");
    });

    it("Debe obtener una adopción existente", async () => {
      const adoption = await Adoption.create({
        owner: user._id,
        pet: pet._id,
      });

      const response = await request(app)
        .get(`/api/adoptions/${adoption._id}`)
        .expect(200);

      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.exist;
    });
  });

  describe("POST /api/adoptions/:uid/:pid", () => {
    it("Debe devolver 404 si el usuario no existe", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/adoptions/${fakeUserId}/${pet._id}`)
        .expect(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("user Not found");
    });

    it("Debe devolver 404 si la mascota no existe", async () => {
      const fakePetId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/adoptions/${user._id}/${fakePetId}`)
        .expect(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("Pet not found");
    });

    it("Debe crear una adopción correctamente", async () => {
      const response = await request(app)
        .post(`/api/adoptions/${user._id}/${pet._id}`)
        .expect(200);

      expect(response.body.status).to.equal("success");
      expect(response.body.message).to.equal("Pet adopted");

      const adoption = await Adoption.findOne({
        owner: user._id,
        pet: pet._id,
      });

      expect(adoption).to.exist;

      const updatedPet = await Pet.findById(pet._id);

      expect(updatedPet.adopted).to.equal(true);
    });

    it("Debe devolver 400 si la mascota ya fue adoptada", async () => {
      const response = await request(app)
        .post(`/api/adoptions/${user._id}/${pet._id}`)
        .expect(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("Pet is already adopted");
    });
  });
});
