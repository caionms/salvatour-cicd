import userController from "../../../src/controller/user.controller.js";
import userService from "../../../src/services/user.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("../../../src/services/user.service.js");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("User Controller", () => {
  describe("findById", () => {
    it("should return user details by ID", async () => {
      userService.findByIdService.mockResolvedValue({ id: "user123", name: "John Doe" });

      const req = { id: "user123" };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.findById(req, res);

      expect(userService.findByIdService).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: "user123", name: "John Doe" });
    });

    it("should handle internal server error", async () => {
      userService.findByIdService.mockRejectedValue(new Error("Internal Error"));

      const req = { id: "user123" };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateLoggedUser", () => {
    it("should update user details successfully", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const req = {
        headers: { authorization: "Bearer token" },
        body: { name: "Jane Doe", password: "newpassword" },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.updateLoggedUser(req, res);

      expect(userService.updateService).toHaveBeenCalledWith(
        "user123",
        "Jane Doe",
        undefined,
        "hashedPassword",
        undefined,
        undefined
      );
      expect(res.json).toHaveBeenCalledWith({ message: "User successfully updated!" });
    });

    it("should return error if no fields are provided", async () => {
      const req = { headers: { authorization: "Bearer token" }, body: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.updateLoggedUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please add at least one of the fields: name, email, password, city, state",
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      userService.deleteUser.mockResolvedValue({ success: true });

      const req = { headers: { authorization: "Bearer token" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.deleteUser(req, res);

      expect(jwt.verify).toHaveBeenCalledWith("token", process.env.SECRET_JWT_KEY);
      expect(userService.deleteUser).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should handle internal server error", async () => {
      userService.deleteUser.mockRejectedValue(new Error("Internal Error"));

      const req = { headers: { authorization: "Bearer token" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("findByToken", () => {
    it("should return user details by token", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      userService.findByIdService.mockResolvedValue({ id: "user123", name: "John Doe" });

      const req = { headers: { authorization: "Bearer token" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.findByToken(req, res);

      expect(jwt.verify).toHaveBeenCalledWith("token", process.env.SECRET_JWT_KEY);
      expect(userService.findByIdService).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: "user123", name: "John Doe" });
    });

    it("should handle internal server error", async () => {
      userService.findByIdService.mockRejectedValue(new Error("Internal Error"));

      const req = { headers: { authorization: "Bearer token" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await userController.findByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
