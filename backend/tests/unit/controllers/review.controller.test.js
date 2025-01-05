import reviewController from "../../../src/controller/review.controller.js";
import reviewService from "../../../src/services/review.service.js";
import touristAttraction from "../../../src/services/touristAttraction.service.js";
import jwt from "jsonwebtoken";

jest.mock("../../../src/services/review.service.js");
jest.mock("../../../src/services/touristAttraction.service.js");
jest.mock("jsonwebtoken");

describe("Review Controller", () => {
  describe("createReview", () => {
    it("should create a review successfully", async () => {
      touristAttraction.findByIdService.mockResolvedValue(true);
      jwt.verify.mockReturnValue({ id: "user123" });
      reviewService.createReview.mockResolvedValue({ id: "review123", rating: 5 });

      const req = {
        params: { touristAttractionId: "attraction123" },
        body: { rating: 5 },
        headers: { authorization: "Bearer token" },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.createReview(req, res);

      expect(touristAttraction.findByIdService).toHaveBeenCalledWith("attraction123");
      expect(jwt.verify).toHaveBeenCalledWith("token", process.env.SECRET_JWT_KEY);
      expect(reviewService.createReview).toHaveBeenCalledWith({
        userId: "user123",
        touristAttractionId: "attraction123",
        rating: 5,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "review123", rating: 5 });
    });

    it("should return error if tourist attraction is not found", async () => {
      touristAttraction.findByIdService.mockResolvedValue(null);

      const req = {
        params: { touristAttractionId: "invalidAttraction" },
        body: { rating: 5 },
        headers: { authorization: "Bearer token" },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "touristAttractionId not found" });
    });
  });

  describe("getUserReviews", () => {
    it("should get user reviews successfully", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      reviewService.getUserReviews.mockResolvedValue([
        { id: "review1", rating: 5 },
        { id: "review2", rating: 4 },
      ]);

      const req = { headers: { authorization: "Bearer token" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.getUserReviews(req, res);

      expect(jwt.verify).toHaveBeenCalledWith("token", process.env.SECRET_JWT_KEY);
      expect(reviewService.getUserReviews).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: "review1", rating: 5 },
        { id: "review2", rating: 4 },
      ]);
    });
  });

  describe("deleteReview", () => {
    it("should delete a review successfully", async () => {
      reviewService.deleteReview.mockResolvedValue(true);

      const req = { params: { reviewId: "review123" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.deleteReview(req, res);

      expect(reviewService.deleteReview).toHaveBeenCalledWith("review123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Review deleted successfully" });
    });

    it("should return error if review is not found", async () => {
      reviewService.deleteReview.mockResolvedValue(null);

      const req = { params: { reviewId: "invalidReview" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    });
  });
});
