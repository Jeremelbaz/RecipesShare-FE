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


export const createPost = async (postData: PostData) => {
  try {
    const response = await apiClient.post('/posts', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; 
  }
};

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

// Fetch post by ID
export const getPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// create a comment to a post
export const addComment = async (postId: string, content: string) => {
  try {
      const response = await apiClient.post("/comments", { postId, content });
      return response.data;
  } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
  }
};

// like / unlike a post
export const likePost = async (postId: string) => {
  try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
  } catch (error) {
      console.error("Error liking post:", error);
      throw error;
  }
};

// Get post analyzed 
export const getPostAnalysis = async (postId: string) => {
  try {
      const response = await apiClient.get(`/posts/${postId}/analyze`);
      console.log(response.data);
      return response.data.analysis;
  } catch (error) {
      console.error("Error fetching post analysis:", error);
      throw error;
  }
};
