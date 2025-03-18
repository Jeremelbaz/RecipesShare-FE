import { useState, useEffect, useRef } from 'react';
import { fetchUserProfile, updateProfilePicture } from '../../services/user-service';
import style from '../../styles/Profile.module.css';

function Profile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        profileImage: '',
        recipes: []
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        loadProfile();
    }, []);

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                const updatedUser = await updateProfilePicture(file);
                setUser(prevUser => ({ ...prevUser, profileImage: updatedUser.profileImage }));
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`vstack gap-3 col-md-7 mx-auto ${style.myFont}`}>
            <div className={style.profileContainer}>
                <img src={user.profileImage} alt="Profile" className={style.profileImage} />
                <button className={style.uploadButton} onClick={triggerFileInput}>Change Profile Picture</button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleProfilePictureChange} 
                />
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            
            <div className={style.recipesContainer}>
                <h3>My Recipes</h3>
                {user.recipes.length > 0 ? (
                    <ul>
                        {user.recipes.map((recipe, index) => (
                            <li key={index} className={style.recipeItem}>{recipe}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No recipes yet. Start adding your favorite dishes!</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
