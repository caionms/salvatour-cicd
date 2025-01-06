import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Places from "./Places";

// Mock para o Header e Carousel
vi.mock("./Header", () => ({
  default: () => <div>Mocked Header</div>,
}));

vi.mock("./Carousel", () => ({
  default: () => <div>Mocked Carousel</div>,
}));

describe("Places Component", () => {
  it("deve renderizar o componente corretamente", () => {
    render(
      <MemoryRouter>
        <Places />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
    expect(screen.getByText("Mocked Carousel")).toBeInTheDocument();
  });

  it("deve incluir o componente Header", () => {
    render(
      <MemoryRouter>
        <Places />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
  });

  it("deve incluir o componente Carousel", () => {
    render(
      <MemoryRouter>
        <Places />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked Carousel")).toBeInTheDocument();
  });
});
