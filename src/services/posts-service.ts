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
      const response = await apiClient.get('/posts');
      return response.data; // Return the data from the API response
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error; // Rethrow the error to be handled by the caller
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
  
