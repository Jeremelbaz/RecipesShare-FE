import React, { useState, useEffect } from 'react';
import { fetchUserProfile, IUser } from '../../services/user-service';
import { fetchUserPosts, deletePost, updatePost } from '../../services/posts-service';
import { PostData } from '../Post/Post';
import style from '../../styles/Profile.module.css';

export interface userPostData extends PostData {
    _id: string;
}

function Profile() {
    const [user, setUser] = useState<IUser | null>(null);
    const [recipes, setRecipes] = useState<userPostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const userData = await fetchUserProfile();
                setUser(userData);

                const userPosts = await fetchUserPosts();
                setRecipes(userPosts);
            } catch (err: any) {
                setError(err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleDeleteRecipe = async (recipeId: string) => {
        try {
            await deletePost(recipeId);
            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        } catch (err: any) {
            setError(err.message || "Failed to delete recipe.");
        }
    };

    const handleUpdateRecipe = async (updatedRecipe: userPostData) => {
        try {
            await updatePost(updatedRecipe._id, updatedRecipe);
            setRecipes(recipes.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe));
        } catch (err: any) {
            setError(err.message || "Failed to update recipe.");
        }
    };

    if (loading) return <div><p>Loading...</p></div>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>User not found.</p>;

    return (
        <div className={style.profilePage}>
            <div className={style.profileContainer}>
                <h2>Welcome ❤️</h2>
                {user.profileImage && <img className={style.profileImage} src={user.profileImage} alt="Profile" />}
                <h2>{user.email}</h2>
                <h2>My Recipes</h2>
                {recipes.length > 0 ? (
                    <div>
                        {recipes.map((recipe) => (
                            <div key={recipe.title} className={style.recipeContainer}>
                                {recipe.title} - {recipe.content}
                                <br />
                                <button onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
                                <button onClick={() => handleUpdateRecipe(recipe)}>Update</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;