export interface PostData {
    title: string;
    content: string;
    owner: string;
    image?: string;
    likes: string[];
    createdAt: Date; 
    updatedAt: Date; 
}

interface PostProps {
    post: PostData
}

function Post({ post }: PostProps) {
    return (
        <div>
            <h1>owner:{post.owner} title:{post.title}</h1>
            <h2>{post.image}</h2>
            <h3>{post.content} </h3>
            <h4>{post.likes}</h4>
            <h5>created at: {post.createdAt.toString()} updated at: {post.updatedAt.toString()} </h5>
        </div>
    )
}

export default Post