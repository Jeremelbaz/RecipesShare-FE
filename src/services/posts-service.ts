import apiClient, { CanceledError } from "./api-client"
import { getUserId } from "./user-service";

import { PostData } from "../components/Post/Post"

export interface IPost {
    title: string;
    content: string;
    owner: string;
    image?: string; 
    likes: string[]; 
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

export const getPosts = async () => {
  try {
    const response = await apiClient.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    throw error;
  }
};
  
export const getCommentsForPost = async (postId: string) => {
  try {
    const response = await apiClient.get("/comments", {
      params: { postId },
    });
    console.log('comments' + response.data[0]);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async (postId: string, content: string) => {
  try {
      const response = await apiClient.post("/comments", { postId, content });
      return response.data;
  } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
  } catch (error) {
      console.error("Error liking post:", error);
      throw error;
  }
};

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

export const fetchUserPosts = async () => {
  try {
      const currUser = getUserId()
      if (currUser){
        const response = await apiClient.get("/posts", {
          params: { owner: currUser},
        });
        return response.data;
      }
      
  } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
      const response = await apiClient.delete(`/posts/${postId}`);
      return response.data;
  } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
  }
};

export const updatePost = async (id: String, updatedPost: PostData) => {
  try {
      const response = await apiClient.put(`/posts/${id}`, updatedPost);
      return response.data;
  } catch (error) {
      console.error("Error updating post:", error);
      throw error;
  }
};
