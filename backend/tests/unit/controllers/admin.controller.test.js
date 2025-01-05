import adminController from "../../../src/controller/admin.controller.js";
import adminService from "../../../src/services/admin.service.js";
import userService from "../../../src/services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../../src/services/admin.service.js");
jest.mock("../../../src/services/user.service.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Admin Controller", () => {
  describe("findAll", () => {
    it("should return a list of users if they exist", async () => {
      const mockUsers = [{ id: 1, name: "John Doe" }];
      adminService.findAll.mockResolvedValue(mockUsers);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await adminController.findAll(req, res);

      expect(adminService.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should return an error if no users are found", async () => {
      adminService.findAll.mockResolvedValue([]);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await adminController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "There are no registered users" });
    });
  });

  describe("updateAdmin", () => {
    it("should return an error if no fields are provided", async () => {
      const req = { params: { id: "123" }, body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await adminController.updateAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please add at least one of the fields: name, email, password, city, state",
      });
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user successfully", async () => {
      jwt.verify.mockReturnValue({ id: "admin123" });
      adminService.deleteUserById.mockResolvedValue({ success: true });

      const req = {
        headers: { authorization: "Bearer token" },
        params: { id: "user456" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await adminController.deleteUserById(req, res);

      expect(jwt.verify).toHaveBeenCalledWith("token", process.env.SECRET_JWT_KEY);
      expect(adminService.deleteUserById).toHaveBeenCalledWith("admin123", "user456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return an error if token is invalid", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const req = { headers: { authorization: "Bearer invalidToken" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await adminController.deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
