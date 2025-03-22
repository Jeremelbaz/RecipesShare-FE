import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../services/posts-service";
import style from "../../styles/allPosts.module.css";

const AllPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [postsPerPage] = useState<number>(4); // Number of posts per page

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                setError("Failed to fetch posts.");
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <div className={style.progress_bar}><p>Loading...</p></div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={`${style.all_posts_container} ${style.myFont}`}>
            <h1></h1>
            <div>
                {currentPosts.map((post) => (
                    <div key={post._id} className={`${style.post_container} post-card`}>
                        <h3>Recipe: {post.title}</h3>
                        <h5>Created by: {post.owner.email || "" }</h5>
                        {post.image && <img src={post.image} alt="Post Image" className={style.postImage} />}
                        <h6>likes: {post.likes.length}</h6>
                        <p className={style.postContentTruncated}>{post.content}</p>
                        <Link to={`/posts/${post._id}`}>Read More...</Link>
                    </div>
                ))}
            </div>
            <div className={style.paging_container}>
                <div className={style.paging}>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
                        <button key={i} onClick={() => paginate(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllPosts;