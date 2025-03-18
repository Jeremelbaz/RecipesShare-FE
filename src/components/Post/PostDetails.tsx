import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getCommentsForPost, addComment, likePost, getPostAnalysis } from "../../services/posts-service";
import style from "../../styles/postDetails.module.css";


function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const timeString = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${dateString} ${timeString}`;
}

function formatAnalysis(analysisString: string): string {
    if (!analysisString) return ""; // Handle empty or undefined input

    const items = analysisString.split(/\d+\.\s/);
    // Remove the first empty element if it exists
    if (items[0] === "") {
        items.shift();
    }
    return items.join("\n");
}

const PostDetails: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true);
            setAnalysisLoading(true);
            try {
                const fetchedAnalysis = await getPostAnalysis(postId!);
                const fetchedPost = await getPostById(postId!);
                const fetchedComments = await getCommentsForPost(postId!);
                setPost(fetchedPost);
                setComments(fetchedComments);
                setAnalysis(fetchedAnalysis);
            } catch (err) {
                setError("Failed to fetch post details.");
                console.error("Failed to fetch post details:", err);
            } finally {
                setLoading(false);
                setAnalysisLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const addedComment = await addComment(postId!, newComment);
                setComments([...comments, addedComment]);
                setNewComment("");
            } catch (err) {
                console.error("Error adding comment:", err);
            }
        }
    };

    const handleLikePost = async () => {
        try {
            const updatedPost = await likePost(postId!);
            setPost(updatedPost);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    if (loading) return <div className={style.loading}>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!post) return <div>Post not found.</div>;

    return (
        <div className={`${style.post_details_container} ${style.myFont}`}>
            <h1>Recipe</h1>
            <h2>{post.title}</h2>
            <h5>Created by: {post.owner.email || ""}</h5>
            <hr/>
            <h6>Created At: {formatTimestamp(post.createdAt)}</h6>
            <h6>Updated At: {formatTimestamp(post.updatedAt)}</h6>
            <h4>Likes: {post.likes.length}</h4>
            {post.image && <img src={post.image} alt="Post Image" className={style.postImage} />}
            <button onClick={handleLikePost}>Like</button>
            <hr/>
            <h4>Gemini's Advice</h4>
            {analysisLoading ? (
            <div>Loading analysis...</div>
        ) : (
            <p className={style.analyze}>
                {formatAnalysis(analysis)}
            </p>
        )}
            <hr/>
            <h5>{post.content}</h5>
            <hr/>
            <h2>Comments</h2>
            <div>
                {comments.map((comment: any) => (
                    <div key={comment._id} className={style.comment}>
                        <p>add user who created comment: {comment.content} , Commented at: {formatTimestamp(comment.createdAt)}</p>
                    </div>
                ))}
            </div>

            <div className={style.insetComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={style.textComment}
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>
    );
};

export default PostDetails;