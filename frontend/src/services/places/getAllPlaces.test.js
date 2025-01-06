import { getAllPlaces } from "./getAllPlaces"; 
import axios from "axios";
import { vi } from "vitest";
import { ALL_PLACES_ENDPOINT } from "../../constants/urls";

vi.mock("axios");

describe("getAllPlaces", () => {
  const mockEndpoint = ALL_PLACES_ENDPOINT
  const mockToken = "mock-access-token";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("successfully fetches all places and resolves with data", async () => {
    const mockResponse = { status: 200, data: [{ id: 1, name: "Place 1" }, { id: 2, name: "Place 2" }] };
    axios.get.mockResolvedValue(mockResponse);

    const result = await getAllPlaces(mockToken);

    expect(axios.get).toHaveBeenCalledWith(mockEndpoint, expect.objectContaining({
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
    }));
    expect(result).toEqual(mockResponse.data);
  });

  test("rejects when the status code is not 200", async () => {
    const mockResponse = { status: 500, data: { error: "Internal Server Error" } };
    axios.get.mockResolvedValue(mockResponse);

    await expect(getAllPlaces(mockToken)).rejects.toEqual(mockResponse);

    expect(axios.get).toHaveBeenCalledWith(mockEndpoint, expect.objectContaining({
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
    }));
  });

  test("handles axios errors and rejects with the error object", async () => {
    const mockError = new Error("Network Error");
    axios.get.mockRejectedValue(mockError);

    await expect(getAllPlaces(mockToken)).rejects.toThrow("Network Error");

    expect(axios.get).toHaveBeenCalledWith(mockEndpoint, expect.objectContaining({
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
    }));
  });
});
