import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCommentsForPost } from "../../services/posts-service";

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Get postId from URL
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  // Fetch the post details and comments
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/posts/${postId}`);
        const post = await response.json();
        setPost(post);

        // Fetch comments using the service
        if (postId) {
          const comments = await getCommentsForPost(postId);
          setComments(comments);
        }
        setComments(comments);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!post) {
    return <div>Loading post details...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
      <p>{post.content}</p>
      <h3>Comments</h3>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} style={{ marginBottom: "10px" }}>
              <p><strong>{comment.owner}</strong>: {comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
