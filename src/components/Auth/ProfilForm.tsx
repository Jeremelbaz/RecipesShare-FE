import { useState, useEffect, useRef } from 'react';
import { fetchUserProfile, updateProfilePicture, IUser } from '../../services/user-service';
import style from '../../styles/ProfilForm.module.css';

function Profile() {
    const [user, setUser] = useState<IUser>({
        _id: '',
        email: '',
        profileImage: '',
        recipes: []
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                
                if (!userData.email) {
                    console.error("User data does not contain an email.");
                }

                setUser({
                    _id: userData._id || '',
                    email: userData.email || '',
                    profileImage: userData.profileImage || '',
                    recipes: Array.isArray(userData.recipes) ? userData.recipes : []
                });
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
                console.log("Uploading profile picture...");
                const updatedUser = await updateProfilePicture(file);
                
                if (updatedUser && updatedUser.profileImage) {
                    setUser(prevUser => ({ ...prevUser, profileImage: updatedUser.profileImage }));
                } else {
                    console.error("Profile image update failed: No image returned.");
                }
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
                <img 
                    src={user.profileImage || '/default-avatar.png'} 
                    alt="Profile" 
                    className={style.profileImage} 
                />
                <button className={style.uploadButton} onClick={triggerFileInput}>
                    Change Profile Picture
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleProfilePictureChange} 
                />
                
                {user.email ? (
                    <>
                        <h2>{user.email}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                    </>
                ) : (
                    <p className="text-danger">Email not available.</p>
                )}
            </div>

            <div className={style.recipesContainer}>
                <h3>My Recipes</h3>
                {user.recipes && user.recipes.length > 0 ? (
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
