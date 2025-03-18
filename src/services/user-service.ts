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
            localStorage.setItem('userId', response.data.userId); // Store the user ID
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
            localStorage.setItem('userId', response.data.userId); // Store the user ID
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