import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Button from "./Button";
import { LoginContext } from "../../contexts/loginContext";
import { AlertContext } from "../../contexts/alertContext";
import { AlertTypeContext } from "../../contexts/alertTypeContext";
import { loginUser } from "../../services/users/loginUser";
import { MemoryRouter, useNavigate } from "react-router-dom";

// Mock do serviço loginUser
vi.mock("../../services/users/loginUser", () => ({
  loginUser: vi.fn(),
}));

// Mock de useNavigate
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn(),
}));

describe("Button Component", () => {
  const mockSetForm = vi.fn();
  const mockSetShowAlert = vi.fn();
  const mockSetAlertType = vi.fn();
  const mockNavigate = vi.fn();
  const initialFormState = { email: "", password: "" };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockImplementation(() => mockNavigate);
  });

  const renderWithContext = (formState = initialFormState) => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={[formState, mockSetForm]}>
          <AlertContext.Provider value={[false, mockSetShowAlert]}>
            <AlertTypeContext.Provider value={[null, mockSetAlertType]}>
              <Button />
            </AlertTypeContext.Provider>
          </AlertContext.Provider>
        </LoginContext.Provider>
      </MemoryRouter>
    );
  };

  it("deve renderizar o botão corretamente", () => {
    renderWithContext();
    expect(screen.getByRole("button", { name: /fazer login/i })).toBeInTheDocument();
  });

  it("deve exibir alerta quando email e senha forem inválidos", async () => {
    renderWithContext({ email: "invalid", password: "short" });

    fireEvent.click(screen.getByRole("button", { name: /fazer login/i }));

    await waitFor(() => {
      expect(mockSetShowAlert).toHaveBeenCalledWith(true);
      expect(mockSetAlertType).toHaveBeenCalledWith("Usuário e senha incorretos");
    });
  });

  it("deve exibir alerta para senha inválida", async () => {
    renderWithContext({ email: "user@example.com", password: "short" });

    fireEvent.click(screen.getByRole("button", { name: /fazer login/i }));

    await waitFor(() => {
      expect(mockSetShowAlert).toHaveBeenCalledWith(true);
      expect(mockSetAlertType).toHaveBeenCalledWith("Senha incorreta");
    });
  });
});
