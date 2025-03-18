import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    //baseURL: 'https://10.10.248.100',
    baseURL: 'http://127.0.0.1:3000',
});

// Interceptor to add the token to the headers for each request
apiClient.interceptors.request.use((config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("refreshToken");
  
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  
    return config;
  }, (error) => {
    // Handle the error if the request configuration fails
    return Promise.reject(error);
  });

/*apiClient.interceptors.response.use(
    (response) => response, // Return response if no error
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Get the refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            // Send a request to the server to refresh the access token
            const refreshResponse = await apiClient.post('/auth/refresh', { token: refreshToken });
            const newAccessToken = refreshResponse.data.accessToken;
            
            // Store the new access token
            localStorage.setItem('authToken', newAccessToken);
            
            // Retry the failed request with the new access token
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(error.config);
          } catch (refreshError) {
            // If refreshing fails, logout the user
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            // Redirect to login page (optional)
            window.location.href = '/login';
          }
        } else {
          // If no refresh token is available, logout the user
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Redirect to login page (optional)
          window.location.href = '/register';
        }
      }
  
      return Promise.reject(error);
    }
  );*/

export default apiClient;