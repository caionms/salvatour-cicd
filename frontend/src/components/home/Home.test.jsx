import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

describe("Home Component", () => {
  it("deve renderizar o componente corretamente", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(
      screen.getByText("Guia histórico de Salvador")
    ).toBeInTheDocument();
  });

  it("deve exibir o título e o subtítulo corretamente", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Guia histórico de Salvador")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Venha descobrir Salvador, onde a história, a cultura e a beleza natural se encontram de forma única. É um destino que promete experiências inesquecíveis, desde seu centro histórico vibrante até suas paisagens naturais deslumbrantes."
      )
    ).toBeInTheDocument();
  });

  it("deve renderizar todas as imagens do grid", () => {
    const {container} = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const gridImages = container.querySelectorAll("img");
    expect(gridImages).toHaveLength(6);
  });

  it("deve exibir o botão 'Ver mais' e redirecionar corretamente", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const viewMoreButton = screen.getByText("Ver mais");
    expect(viewMoreButton).toBeInTheDocument();
    expect(viewMoreButton.closest("a")).toHaveAttribute("href", "/places");
  });

  it("deve incluir o componente Header", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Olá, seja bem vindo(a)")).toBeInTheDocument();
  });
});
