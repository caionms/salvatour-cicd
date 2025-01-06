import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Carousel from "./Carousel";
import { getAllPlaces } from "../../services/places/getAllPlaces";
import { deletePlace } from "../../services/places/deletePlace";
import { MemoryRouter } from "react-router-dom";

// Mock de funções externas
vi.mock("../../services/places/getAllPlaces", () => ({
  getAllPlaces: vi.fn(),
}));

vi.mock("../../services/places/deletePlace", () => ({
  deletePlace: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

describe("Carousel Component", () => {
  const mockPlaces = [
    {
      _id: "1",
      name: "Local A",
      image: "imageA.jpg",
      description: "Descrição do Local A",
      address: "Endereço do Local A",
      openingHours: "09:00 - 18:00",
    },
    {
      _id: "2",
      name: "Local B",
      image: "imageB.jpg",
      description: "Descrição do Local B",
      address: "Endereço do Local B",
      openingHours: "10:00 - 20:00",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getAllPlaces.mockResolvedValue(mockPlaces);
  });

  afterEach(() => {
    cleanup()
  })

  it("deve renderizar o componente corretamente", async () => {
    render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>
    );

    expect(await screen.findByText("Local A")).toBeInTheDocument();
    expect(await screen.findByText("Local B")).toBeInTheDocument();
  });

  it("deve carregar locais ao montar o componente", async () => {
    render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>
    );

    expect(getAllPlaces).toHaveBeenCalledWith(localStorage.getItem("token"));
    expect(await screen.findByText("Local A")).toBeInTheDocument();
  });

  it("deve exibir os locais no carrossel", async () => {
    render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>
    );

    const placeNames = await screen.findAllByRole("heading", { level: 1 });
    expect(placeNames).toHaveLength(mockPlaces.length);
    expect(placeNames[0]).toHaveTextContent("Local A");
    expect(placeNames[1]).toHaveTextContent("Local B");
  });

  it("deve exibir os botões de navegação do carrossel", () => {
    const { container } = render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>
    );


    expect(container.querySelector(".carousel-control-prev")).toBeInTheDocument();
    expect(container.querySelector(".carousel-control-next")).toBeInTheDocument();
  });


  it("deve exibir o modal de informações adicionais corretamente", async () => {
    render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>
    );

    const [moreInfoButton] = await screen.findAllByText("Mais informações");
    fireEvent.click(moreInfoButton);

    expect(await screen.findByText("Endereço do Local A")).toBeInTheDocument();
    expect(await screen.findByText("09:00 - 18:00")).toBeInTheDocument();
  });
});
