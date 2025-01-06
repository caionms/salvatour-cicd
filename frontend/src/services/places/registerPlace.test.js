import { registerPlace } from "./registerPlace";
import axios from "axios";
import { vi } from "vitest";
import { NEW_PLACE_ENDPOINT } from "../../constants/urls";

vi.mock("axios");

describe("registerPlace", () => {
  const mockEndpoint = NEW_PLACE_ENDPOINT;
  const mockToken = "mock-access-token";

  const mockData = {
    name: "Test Place",
    address: "123 Test Street",
    openingHours: "9 AM - 5 PM",
    description: "A test place description",
    image: "test-image.jpg",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("successfully registers a new place and resolves with data", async () => {
    const mockResponse = { status: 201, data: { success: true, id: 1 } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await registerPlace(
      mockData.name,
      mockData.address,
      mockData.openingHours,
      mockData.description,
      mockData.image,
      mockToken
    );

    expect(axios.post).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining(mockData),
      expect.objectContaining({
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${mockToken}`,
        },
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("handles axios errors and rejects with the error object", async () => {
    const mockError = new Error("Network Error");
    axios.post.mockRejectedValue(mockError);

    await expect(
      registerPlace(
        mockData.name,
        mockData.address,
        mockData.openingHours,
        mockData.description,
        mockData.image,
        mockToken
      )
    ).rejects.toThrow("Network Error");

    expect(axios.post).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining(mockData),
      expect.objectContaining({
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${mockToken}`,
        },
      })
    );
  });
});
