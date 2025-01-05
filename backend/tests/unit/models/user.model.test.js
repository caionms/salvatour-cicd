import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../../src/models/User.js";

describe("User Model", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Garante que os índices únicos são criados
    await User.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a user successfully", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "securepassword",
      city: "San Francisco",
      state: "CA",
      isAdmin: true,
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("John Doe");
    expect(savedUser.email).toBe("johndoe@example.com");
    expect(savedUser.city).toBe("San Francisco");
    expect(savedUser.state).toBe("CA");
    expect(savedUser.isAdmin).toBe(true);
  });

  it("should enforce unique email", async () => {
    const user1 = new User({
      name: "John Doe",
      email: "unique@example.com",
      password: "password1",
      city: "San Francisco",
      state: "CA",
    });
  
    const user2 = new User({
      name: "Jane Doe",
      email: "unique@example.com", // Mesmo email
      password: "password2",
      city: "Los Angeles",
      state: "CA",
    });
  
    await user1.save();
  
    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
  
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Código de erro para chave duplicada
  });  

  it("should fail if required fields are missing", async () => {
    const user = new User({});

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
    expect(error.errors.city).toBeDefined();
    expect(error.errors.state).toBeDefined();
  });
});
