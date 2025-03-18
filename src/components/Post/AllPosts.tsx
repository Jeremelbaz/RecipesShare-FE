import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../services/posts-service";

const AllPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (error) {
        setError("Failed to fetch posts.");
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>All Posts</h1>
      <div>
        {posts.map((post) => (
          <div key={post._id} className="post-card" style={{ marginBottom: "20px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <Link to={`/posts/${post._id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
