import { CredentialResponse } from "@react-oauth/google"
import apiClient from "./api-client"

export interface IUser {
    email: string;
    password?: string;
    _id?: string;
    refreshToken?: string[];
    profileImage?: string; // Path to the image file
    googleId?: string;
}

export const registrUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user...")
        console.log(user)
        apiClient.post("/auth/register", user).then((response) => {
            console.log(response)
            localStorage.setItem('authToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('userId', response.data.userId); 
            resolve(response.data)
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
};


export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("googleSignin ...");
        apiClient.post("/auth/google", credentialResponse).then((response) => {
            console.log(response);
            localStorage.setItem('authToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('userId', response.data._id);
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
};

export const getUserId = (): string | null => {
    return localStorage.getItem('userId');
};

export const loginUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Logging in user...")
        console.log(user)
        apiClient.post("/auth/login", user).then((response) => {
            console.log(response)
            localStorage.setItem('authToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            localStorage.setItem('userId', response.data._id)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const logoutUser = () => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await apiClient.post("/auth/logout", {
                    refreshToken: refreshToken,
                });
            }

            localStorage.clear(); // Clear all localStorage items
            resolve();
        } catch (error) {
            console.error("Logout failed:", error);
            reject(error);
        }
    });
};

export const getUserById = (userId: string) => {
    return new Promise<IUser>((resolve, reject) => {
      apiClient
        .get(`/auth/${userId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchUserProfile = () => {
    return new Promise<IUser>((resolve, reject) => {
        apiClient
          .get(`/auth/${getUserId()}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
};

export const updateProfilePicture = (file: File) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Updating profile picture...");

        const formData = new FormData();
        formData.append("profileImage", file);

        const token = localStorage.getItem('authToken'); // Get auth token
        if (!token) {
            reject("No auth token found");
            return;
        }

        apiClient.put("/auth/profile/picture", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.error("Error updating profile picture:", error);
            reject(error);
        });
    });
};


export const updateUser = (userId: string, updatedUser: Partial<IUser>) => {
    return new Promise<IUser>((resolve, reject) => {
        apiClient
        .put(`/auth/${userId}`, updatedUser)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}; 