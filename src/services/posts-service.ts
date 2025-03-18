import apiClient, { CanceledError } from "./api-client"

import { PostData } from "../components/Post/Post"

export interface IPost {
    title: string;
    content: string;
    owner: string; // ref to user
    image?: string; // path to image in server
    likes: string[]; // array of users' ids that liked the post
    createdAt: Date; 
    updatedAt: Date; 
}

// Function to fetch posts
export const getPosts = async () => {
  try {
    const response = await apiClient.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    throw error;
  }
};

 export const createPost = async (formData: FormData) => {
    try {
      const response = await apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
// Fetch comments for a post
export const getCommentsForPost = async (postId: string) => {
  try {
    const response = await apiClient.get("/comments", {
      params: { postId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
