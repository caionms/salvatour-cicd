import touristAttractionController from "../../../src/controller/touristAttraction.controller.js";
import touristAttractionService from "../../../src/services/touristAttraction.service.js";

jest.mock("../../../src/services/touristAttraction.service.js");

describe("TouristAttraction Controller", () => {
  describe("getAttractions", () => {
    it("should return a list of attractions", async () => {
      const mockAttractions = [
        { _id: "1", name: "Attraction 1", image: null },
        { _id: "2", name: "Attraction 2", image: null },
      ];
      touristAttractionService.findAllService.mockResolvedValue(mockAttractions);

      const req = { protocol: "http", get: jest.fn(() => "localhost:3000") };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.getAttractions(req, res);

      expect(touristAttractionService.findAllService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAttractions);
    });

    it("should handle internal server error", async () => {
      touristAttractionService.findAllService.mockRejectedValue(new Error("Internal Error"));

      const req = { protocol: "http", get: jest.fn(() => "localhost:3000") };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.getAttractions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("getImage", () => {
    it("should return an image", async () => {
      const mockAttraction = { image: "base64ImageData" };
      touristAttractionService.findByIdService.mockResolvedValue(mockAttraction);

      const req = { params: { id: "1" } };
      const res = {
        writeHead: jest.fn(),
        end: jest.fn(),
      };

      await touristAttractionController.getImage(req, res);

      expect(touristAttractionService.findByIdService).toHaveBeenCalledWith("1");
      expect(res.writeHead).toHaveBeenCalledWith(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": Buffer.byteLength("base64ImageData", "base64"),
      });
      expect(res.end).toHaveBeenCalled();
    });

    it("should return error if image is not found", async () => {
      touristAttractionService.findByIdService.mockResolvedValue(null);

      const req = { params: { id: "invalid" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.getImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Image not found" });
    });
  });

  describe("addAttraction", () => {
    it("should add a new attraction", async () => {
      touristAttractionService.createService.mockResolvedValue({ _id: "1" });

      const req = {
        body: {
          name: "Attraction 1",
          address: "123 Main St",
          openingHours: "9AM-5PM",
          description: "A beautiful place",
        },
        file: { buffer: Buffer.from("image data") },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.addAttraction(req, res);

      expect(touristAttractionService.createService).toHaveBeenCalledWith({
        name: "Attraction 1",
        address: "123 Main St",
        openingHours: "9AM-5PM",
        description: "A beautiful place",
        image: Buffer.from("image data").toString("base64"),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tourist Attraction registered successfully",
        id: "1",
      });
    });
  });

  describe("deleteAttraction", () => {
    it("should delete an attraction successfully", async () => {
      touristAttractionService.deleteService.mockResolvedValue(true);

      const req = { params: { id: "1" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.deleteAttraction(req, res);

      expect(touristAttractionService.deleteService).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return error if attraction is not found", async () => {
      touristAttractionService.deleteService.mockResolvedValue(null);

      const req = { params: { id: "invalid" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await touristAttractionController.deleteAttraction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Tourist Attraction not found" });
    });
  });
});
