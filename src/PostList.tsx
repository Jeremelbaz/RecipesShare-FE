import { useEffect, useState } from "react";
import Post from "./components/Post/Post";
import axios from "axios";

// Updated PostData interface with new properties
interface PostData {
    title: string;
    content: string;
    owner: string; // Reference to user
    image?: string; // Optional image path
    likes: string[]; // Array of user IDs who liked the post
    createdAt: Date;
    updatedAt: Date;
}

function PostsList() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Fetching posts...");
        axios
            .get<PostData[]>("http://localhost:3000")
            .then((response) => {
                console.log("Posts received:", response.data);
                setPosts(response.data);
            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts.");
            })
            .finally(() => setLoading(false));

        return () => {
            console.log("Cleanup function executed");
        };
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            {posts.map((post) => (
                <Post key={post.updatedAt.toString()} post={post} />
            ))}
        </div>
    );
}

export default PostsList;
