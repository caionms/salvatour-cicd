import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";
import { LoginContext } from "../../contexts/loginContext";

vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="Eye" />, 
  EyeOff: () => <div data-testid="EyeOff" />
}))

describe("Form Component", () => {
  const mockSetForm = vi.fn();
  const initialFormState = { email: "", password: "" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = () => {
    render(
      <LoginContext.Provider value={[initialFormState, mockSetForm]}>
        <Form />
      </LoginContext.Provider>
    );
  };

  it("deve renderizar os campos de entrada e o botão de alternância da senha", () => {
    renderWithContext();

    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("senha")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("deve atualizar o estado do formulário ao digitar nos campos de entrada", () => {
    renderWithContext();

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("senha");

    fireEvent.change(emailInput, { target: { value: "teste@exemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    expect(mockSetForm).toHaveBeenCalledWith({ email: "teste@exemplo.com", password: "" });
    expect(mockSetForm).toHaveBeenCalledWith({ email: "", password: "senha123" });
  });

  it("deve alternar a visibilidade da senha ao clicar no botão", () => {
    renderWithContext();

    const passwordInput = screen.getByPlaceholderText("senha");
    const toggleButton = screen.getByRole("button");

    // Inicialmente, o campo de senha deve estar no modo "password"
    expect(passwordInput).toHaveAttribute("type", "password");

    // Clique para alternar para o modo "text"
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Clique novamente para voltar ao modo "password"
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("deve alternar entre os ícones Eye e EyeOff ao clicar no botão", () => {
    renderWithContext();

    const toggleButton = screen.getByRole("button");

    // Inicialmente, deve exibir o ícone Eye
    expect(screen.queryByTestId("Eye")).toBeInTheDocument();
    expect(screen.queryByTestId("EyeOff")).not.toBeInTheDocument();

    // Clique para alternar para o ícone EyeOff
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("Eye")).not.toBeInTheDocument();
    expect(screen.queryByTestId("EyeOff")).toBeInTheDocument();
  });

  it("não deve enviar o formulário ao clicar no botão de alternância da senha", () => {
    renderWithContext();

    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);

    // Verificar se o evento onClick foi preventDefault (não enviou o formulário)
    expect(mockSetForm).not.toHaveBeenCalled();
  });
});
