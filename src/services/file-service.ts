import apiClient from "./api-client";

interface IUploadResponse {
  url: string;
}

export const uploadPhoto = async (photo: File): Promise<string> => {
  console.log("Uploading photo...", photo);
  const formData = new FormData();
  formData.append("file", photo); 

  try {
    const response = await apiClient.post<IUploadResponse>("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload successful:", response.data);
    return response.data.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};