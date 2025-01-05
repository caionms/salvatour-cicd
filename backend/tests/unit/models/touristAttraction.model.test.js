import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import TouristAttraction from "../../../src/models/TouristAttraction.js";

describe("TouristAttraction Model", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a tourist attraction successfully", async () => {
    const attraction = new TouristAttraction({
      name: "Eiffel Tower",
      address: "Champ de Mars, 5 Avenue Anatole, 75007 Paris, France",
      openingHours: "9:00 AM - 12:00 AM",
      description: "An iconic symbol of France.",
      image: "eiffel-tower.jpg",
    });

    const savedAttraction = await attraction.save();

    expect(savedAttraction._id).toBeDefined();
    expect(savedAttraction.name).toBe("Eiffel Tower");
    expect(savedAttraction.address).toBe("Champ de Mars, 5 Avenue Anatole, 75007 Paris, France");
    expect(savedAttraction.openingHours).toBe("9:00 AM - 12:00 AM");
    expect(savedAttraction.description).toBe("An iconic symbol of France.");
    expect(savedAttraction.image).toBe("eiffel-tower.jpg");
  });

  it("should fail if required fields are missing", async () => {
    const attraction = new TouristAttraction({});

    let error;
    try {
      await attraction.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.address).toBeDefined();
    expect(error.errors.openingHours).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.image).toBeDefined();
  });

  it("should fail if a field has an invalid type", async () => {
    const attraction = new TouristAttraction({
      name: { value: "invalid" }, // Propositalmente inválido para forçar o erro
      address: "123 Main St",
      openingHours: "9:00 AM - 5:00 PM",
      description: "A beautiful attraction.",
      image: "attraction.jpg",
    });
  
    let error;
    try {
      await attraction.save();
    } catch (err) {
      error = err;
    }
  
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.message).toContain("Cast to string failed for value \"{ value: 'invalid' }\" (type Object) at path \"name\"");
  });
});
