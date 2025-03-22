import React, { useState } from 'react';
import { createPost } from '../../services/posts-service';
import { uploadPhoto } from '../../services/file-service';
import style from '../../styles/Posts.module.css';
import { getUserId } from '../../services/user-service';

interface PostFormProps {
    onPostCreated?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        let imageUrl: string | undefined;

        try {
            if (image) {
                imageUrl = await uploadPhoto(image);
                console.log('Uploaded image URL:', imageUrl);

            }

            const postData = {
                title,
                content,
                image: imageUrl,
                owner: getUserId() || '',
                likes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            console.log('Post data being sent:', postData);
            
            await createPost(postData);
            setTitle('');
            setContent('');
            setImage(null);
            setSuccessMessage('Recipe created successfully!');
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create post.');
            console.error('Error creating post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={`${style.postFormContainer} ${style.myFont}`}>
                <h2>Create a New Recipe</h2>
                {error && <p className={style.errorMessage}>{error}</p>}
                {successMessage && <p className={style.successMessage}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="content">Content:</label>
                        <p>Ingridients and perparation steps...</p>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="image">Image (Optional):</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostForm;