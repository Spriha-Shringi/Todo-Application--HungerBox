import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Login User and Save Token in LocalStorage
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const token = response.data.token; // Assuming the token is in response.data.token
    console.log(token);
    if (token) {
      localStorage.setItem('token', token); // Save the token in localStorage
    }
    return response.data; // Return the full response data, including the token
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Logout User and Remove Token from LocalStorage
export const logoutUser = () => {
  localStorage.removeItem('token'); // Remove token from localStorage on logout
};

// Get Token from LocalStorage
export const getToken = () => {
  return localStorage.getItem('token'); // Retrieve the token from localStorage
};
