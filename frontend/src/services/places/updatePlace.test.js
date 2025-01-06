import { updatePlace } from "./updatePlace"; 
import axios from "axios";
import { vi } from "vitest";
import { UPDATE_PLACE_ENDPOINT } from "../../constants/urls";

vi.mock("axios");

describe("updatePlace", () => {
  const mockEndpoint = UPDATE_PLACE_ENDPOINT;
  const mockToken = "mock-access-token";
  const mockId = "123";

  const mockData = {
    name: "Updated Place",
    address: "456 Updated Street",
    openingHours: "10 AM - 6 PM",
    description: "An updated place description",
    image: "updated-image.jpg",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("successfully updates a place with image and resolves with data", async () => {
    const mockResponse = { status: 200, data: { success: true, id: mockId } };
    axios.patch.mockResolvedValue(mockResponse);

    const result = await updatePlace(
      mockId,
      mockData.name,
      mockData.address,
      mockData.openingHours,
      mockData.description,
      mockData.image,
      mockToken
    );

    expect(axios.patch).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
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

  test("successfully updates a place without an image", async () => {
    const { image, ...dataWithoutImage } = mockData;
    const mockResponse = { status: 200, data: { success: true, id: mockId } };
    axios.patch.mockResolvedValue(mockResponse);

    const result = await updatePlace(
      mockId,
      dataWithoutImage.name,
      dataWithoutImage.address,
      dataWithoutImage.openingHours,
      dataWithoutImage.description,
      null,
      mockToken
    );

    expect(axios.patch).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
      expect.objectContaining(dataWithoutImage),
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
    axios.patch.mockRejectedValue(mockError);

    await expect(
      updatePlace(
        mockId,
        mockData.name,
        mockData.address,
        mockData.openingHours,
        mockData.description,
        mockData.image,
        mockToken
      )
    ).rejects.toThrow("Network Error");

    expect(axios.patch).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
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
