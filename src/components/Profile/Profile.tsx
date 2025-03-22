import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { fetchUserProfile, IUser, updateUser } from '../../services/user-service';
import { fetchUserPosts, deletePost, updatePost } from '../../services/posts-service';
import { uploadPhoto } from '../../services/file-service';
import { PostData } from '../Post/Post';
import style from '../../styles/Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../assets/user.png';

export interface userPostData extends PostData {
  _id: string;
}

function Profile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [recipes, setRecipes] = useState<userPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<userPostData | null>(null);
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [editedRecipeImageFile, setEditedRecipeImageFile] = useState<File | null>(null);

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
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deletePost(recipeId);
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete recipe.');
    }
  };

  const handleUpdateRecipe = async (updatedRecipe: userPostData) => {
    try {
      let imageUrl = updatedRecipe.image;
      if (editedRecipeImageFile) {
        imageUrl = await uploadPhoto(editedRecipeImageFile);
      }
      const updatedRecipeWithImage = { ...updatedRecipe, image: imageUrl };
      await updatePost(updatedRecipe._id, updatedRecipeWithImage);
      setRecipes(recipes.map((recipe) => (recipe._id === updatedRecipe._id ? updatedRecipeWithImage : recipe)));
      setEditingRecipeId(null);
      setEditedRecipe(null);
      setEditedRecipeImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update recipe.');
    }
  };

  const handleEditRecipe = (recipe: userPostData) => {
    setEditingRecipeId(recipe._id);
    setEditedRecipe({ ...recipe });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRecipe((prevRecipe) => (prevRecipe ? { ...prevRecipe, [name]: value } : null));
  };

  const renderRecipe = (recipe: userPostData) => {
    if (editingRecipeId === recipe._id) {
      return (
        <div>
          <input type="text" name="title" value={editedRecipe?.title || ''} onChange={handleInputChange} placeholder="Title" />
          <textarea className={style.textStyle} name="content" value={editedRecipe?.content || ''} onChange={handleInputChange} placeholder="Content" />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setEditedRecipeImageFile(e.target.files[0]);
              }
            }}
          />
          {editedRecipeImageFile && <img src={URL.createObjectURL(editedRecipeImageFile)} alt="Edited Recipe" style={{ maxWidth: '100px' }} />}
          <button onClick={() => handleUpdateRecipe(editedRecipe!)}>Submit</button>
          <button onClick={() => setEditingRecipeId(null)}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div>
          {recipe.title} - {recipe.content}
          {recipe.image && <img src={recipe.image} alt="Recipe Image" style={{ maxWidth: '100px' }} />}
          <br />
          <button onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
          <button onClick={() => handleEditRecipe(recipe)}>Edit Recipe</button>
        </div>
      );
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const uploadProfileImage = async () => {
    if (imgSrc) {
      setUploadingProfileImage(true);
      try {
        const imageUrl = await uploadPhoto(imgSrc);
        const updatedUser = await updateUser({ ...user, profileImage: imageUrl } as IUser);
        setUser(updatedUser);
        setImgSrc(null);
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        setError('Failed to upload profile image.');
      } finally {
        setUploadingProfileImage(false);
      }
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  if (loading) return <div><p>Loading...</p></div>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found.</p>;

return (
    <div className={`${style.profilePage} ${style.myFont}`}>
      <div className={style.profileContainer}>
        <h2>Welcome ❤️</h2>
        <h2>{user.email}</h2>

        <div className="d-flex justify-content-center position-relative">
          <img
            src={user && user.profileImage ? user.profileImage : avatar}
            className={`${style.userImage}`}
            alt="Profile"
          />
          <button  className={style.selectimg} type="button" onClick={selectImg}>
            Select Image
          </button>
          {imgSrc && (
            <button type="button" onClick={uploadProfileImage} disabled={uploadingProfileImage} className={style.selectimg}>
              {uploadingProfileImage ? 'Uploading...' : 'Upload Profile Image'}
            </button>
          )}
        </div>
        <input className={style.imageSelector} ref={fileInputRef} type="file" onChange={handleProfileImageChange} />
        <br/>
        <hr/>
        <h1>My Recipes</h1>
        {recipes.length > 0 ? (
          <div>
            {recipes.map((recipe) => (
              <div key={recipe.title} className={style.recipeContainer}>
                {renderRecipe(recipe)}
              </div>
            ))}
          </div>
        ) : (
          <p>You did not create recipes yet...</p>
        )}
      </div>
    </div>
);
}

export default Profile;