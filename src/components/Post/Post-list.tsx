import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { getPosts, IPost } from '../../services/posts-service';
import { useNavigate } from 'react-router-dom';
import style from '../../styles/Posts.module.css';

function PostList() { // Renamed the component to PostList for clarity
    const navigate = useNavigate();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError((err as Error).message);
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p className='text-danger'>{error}</p>;
    }

    return (
        <div className={`vstack gap-3 col-md-7 mx-auto ${style.myFont}`}>
            <img src={logo} className={style.siteLogo} />
            {posts.map((post, index) => (
                <div key={index} className={style.postItem}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p>Owner: {post.owner}</p>
                    {post.image && <img src={post.image} alt="Post Image" className={style.postImage} />}
                    <p>Likes: {post.likes.length}</p>
                    <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                    <p>Updated At: {new Date(post.updatedAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default PostList;