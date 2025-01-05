import authController from "../../../src/controller/auth.controller.js";
import { loginService, generateToken } from "../../../src/services/auth.service.js";
import userService from "../../../src/services/user.service.js";
import sendMailService from "../../../src/services/sendMail.service.js";
import tokenService from "../../../src/services/token.service.js";
import bcrypt from "bcrypt";

jest.mock("../../../src/services/auth.service.js");
jest.mock("../../../src/services/user.service.js");
jest.mock("../../../src/services/sendMail.service.js");
jest.mock("../../../src/services/token.service.js");
jest.mock("bcrypt");

describe("Auth Controller", () => {
  describe("authenticate", () => {
    it("should authenticate user with valid credentials", async () => {
      loginService.mockResolvedValue({ id: "123", password: "hashedPassword", isAdmin: true });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue("validToken");

      const req = { body: { email: "test@example.com", password: "password123" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.authenticate(req, res);

      expect(loginService).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(generateToken).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "validToken", isAdmin: true });
    });

    it("should return error if user is not found", async () => {
      loginService.mockResolvedValue(null);

      const req = { body: { email: "nonexistent@example.com", password: "password123" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.authenticate(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      userService.findByEmailService.mockResolvedValue(null);
      userService.validatePassword.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userService.registerService.mockResolvedValue({ _id: "newUserId" });

      const req = {
        body: { name: "John Doe", email: "test@example.com", password: "Password123!", city: "City", state: "State" },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.register(req, res);

      expect(userService.findByEmailService).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("Password123!", "salt");
      expect(userService.registerService).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "hashedPassword",
        city: "City",
        state: "State",
        isAdmin: false,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created", id: "newUserId" });
    });

    it("should return error if email is already registered", async () => {
      userService.findByEmailService.mockResolvedValue({});

      const req = {
        body: { name: "John Doe", email: "test@example.com", password: "Password123!", city: "City", state: "State" },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already registered." });
    });
  });

  describe("sendMailController", () => {
    it("should send mail successfully", async () => {
      sendMailService.sendMailService.mockResolvedValue(true);

      const req = { user: { email: "test@example.com" } };
      const res = { json: jest.fn() };

      await authController.sendMailController(req, res);

      expect(sendMailService.sendMailService).toHaveBeenCalledWith("test@example.com");
      expect(res.json).toHaveBeenCalledWith({ message: "email sent successfully" });
    });
  });

  describe("verifyToken", () => {
    it("should verify token successfully", () => {
      tokenService.verifyToken.mockReturnValue({ valid: true });

      const req = { params: { token: "123" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      authController.verifyToken(req, res);

      expect(tokenService.verifyToken).toHaveBeenCalledWith(123);
      expect(res.json).toHaveBeenCalledWith({ message: "Token is valid" });
    });
  });
});
