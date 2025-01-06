import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Header from "./Header";

// Mock para useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Header Component", () => {
  const mockedNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockedNavigate);
    localStorage.clear();
  });

  it("deve renderizar o componente corretamente", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("Olá, seja bem vindo(a)")).toBeInTheDocument();
  });

  it("deve exibir o botão 'Voltar' se não estiver na página inicial", () => {
    render(
      <MemoryRouter initialEntries={["/places"]}>
        <Header />
      </MemoryRouter>
    );
    const backButton = screen.getByText("< Voltar");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("não deve exibir o botão 'Voltar' se estiver na página inicial", () => {
    localStorage.setItem("isAdmin", "false");
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Header />
      </MemoryRouter>
    );
    const backButton = screen.queryByText("< Voltar");
    expect(backButton).not.toBeInTheDocument();
  });

  it("deve exibir as opções do menu ao clicar no dropdown", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const dropdownButton = screen.getByText("Olá, seja bem vindo(a)");
    expect(dropdownButton).toBeInTheDocument();
    fireEvent.click(dropdownButton);
    expect(screen.getByText("Editar perfil")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("deve redirecionar corretamente ao clicar em 'Editar perfil'", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const editProfileLink = screen.getByText("Editar perfil");
    expect(editProfileLink).toHaveAttribute("href", "/updateUser");
  });

  it("deve limpar o localStorage e redirecionar ao clicar em 'Sair'", () => {
    localStorage.setItem("token", "123");
    localStorage.setItem("isAdmin", "true");

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const [logoutLink] = screen.getAllByText("Sair");
    fireEvent.click(logoutLink);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("isAdmin")).toBeNull();
  });
});
