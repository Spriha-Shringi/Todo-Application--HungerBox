import axios from 'axios';

const API_URL = 'https://todo-application-hunger-box-sb97.vercel.app/api/auth';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const token = response.data.token;
    console.log(token);
    if (token) {
      localStorage.setItem('token', token); 
    }
    return response.data; 
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};


export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};


export const checkUserExists = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/check?username=${username}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};


export const resetPassword = async (username, password) =>{
  console.log("Hii");
  try{
    console.log("Hii");
    console.log(username
      ,password);
    const response = await axios.post(`${API_URL}/reset-password`,{username, password});
    return response.data;
  }catch(error){
    console.error('Error during password reset:', error);
    throw error;
  }
}

export const logoutUser = () => {
  localStorage.removeItem('token'); 
};


export const getToken = () => {
  return localStorage.getItem('token'); 
};
