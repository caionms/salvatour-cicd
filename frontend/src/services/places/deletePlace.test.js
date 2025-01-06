import { deletePlace } from "./deletePlace"; 
import axios from "axios";
import { vi } from "vitest";
import { DELETE_PLACE_ENDPOINT } from "../../constants/urls";

vi.mock("axios");

describe("deletePlace", () => {
  const mockEndpoint = DELETE_PLACE_ENDPOINT;
  const mockId = "12345";
  const mockToken = "mock-access-token";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("successfully deletes a place and resolves with data", async () => {
    const mockResponse = { data: { success: true } };
    axios.delete.mockResolvedValue(mockResponse);

    const result = await deletePlace(mockId, mockToken);

    expect(axios.delete).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
      expect.objectContaining({
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${mockToken}`,
        },
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("handles error correctly and rejects with the error", async () => {
    const mockError = new Error("Failed to delete place");
    axios.delete.mockRejectedValue(mockError);

    await expect(deletePlace(mockId, mockToken)).rejects.toThrow("Failed to delete place");

    expect(axios.delete).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
      expect.objectContaining({
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${mockToken}`,
        },
      })
    );
  });

  test("rejects with proper error message when response fails", async () => {
    const mockErrorResponse = { response: { status: 404, data: { error: "Place not found" } } };
    axios.delete.mockRejectedValue(mockErrorResponse);

    await expect(deletePlace(mockId, mockToken)).rejects.toEqual(mockErrorResponse);

    expect(axios.delete).toHaveBeenCalledWith(
      `${mockEndpoint}${mockId}`,
      expect.objectContaining({
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${mockToken}`,
        },
      })
    );
  });
});
