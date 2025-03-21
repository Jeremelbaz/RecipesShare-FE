import { CredentialResponse } from "@react-oauth/google"
import apiClient from "./api-client"

export interface IUser {
    email: string;
    password?: string;
    _id?: string;
    refreshToken?: string[];
    profileImage?: string; // Path to the image file
    googleId?: string;
    recipes?: string[]; // List of recipe IDs
}

export const registrUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user...")
        console.log(user)
        apiClient.post("/auth/register", user).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

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


export const loginUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Logging in user...")
        console.log(user)
        apiClient.post("/auth/login", user).then((response) => {
            console.log(response)
            localStorage.setItem('authToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const fetchUserProfile = () => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Fetching user profile...");
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        if (!token) {
            reject("No auth token found");
            return;
        }

        apiClient.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.error("Error fetching user profile:", error);
            reject(error);
        });
    });
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("googleSignin ...")
        apiClient.post("/auth/google", credentialResponse).then((response) => {
            console.log(response)
            localStorage.setItem('authToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}