import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Review from "../../../src/models/Review.js";

describe("Review Model", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a review successfully", async () => {
    const review = new Review({
      userId: "user123",
      touristAttractionId: "attraction123",
      rating: 4,
    });

    const savedReview = await review.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.userId).toBe("user123");
    expect(savedReview.touristAttractionId).toBe("attraction123");
    expect(savedReview.rating).toBe(4);
  });

  it("should fail if required fields are missing", async () => {
    const review = new Review({});

    let error;
    try {
      await review.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
    expect(error.errors.touristAttractionId).toBeDefined();
    expect(error.errors.rating).toBeDefined();
  });

  it("should fail if rating is out of range", async () => {
    const review = new Review({
      userId: "user123",
      touristAttractionId: "attraction123",
      rating: 6, // Invalid rating
    });

    let error;
    try {
      await review.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.rating).toBeDefined();
    expect(error.errors.rating.message).toContain("Path `rating` (6) is more than maximum allowed value (5).");
  });
});
