import axios from 'axios';
import { getToken } from './authApi';

const API_URL = 'http://localhost:5000/api/todos';

const authHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("No token found! User must be logged in.");
    return null; // Returning null prevents sending a bad request
  }

  return { headers: { Authorization: `Bearer ${token}` } };
};


export const getTodos = async () => {
  const headers = authHeaders();  // Get authorization headers

  if (!headers) {
    console.warn("Skipping API request: No token available.");
    return [];  // Return empty array instead of making a request
  }

  try {
    const response = await axios.get("http://localhost:5000/api/todos", headers);
    return response.data; 
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};


export const createTodo = async (todo) => {
  const response = await axios.post(API_URL, todo, authHeaders());
  return response.data;
};

export const updateTodo = async (id, updates) => {
  console.log(`Updating task ${id} with`, updates); // ✅ Debugging log
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates, authHeaders());
    console.log("Update response:", response.data); // ✅ Debugging log
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteTodo = async (id) => {
  // if (!id) {
  //   console.error("Task ID is undefined, cannot mark as deleted.");
  //   return;
  // }
  // console.log("The task title is" + task.title);
  // console.log("The id is" + task._id);
  await axios.delete(`${API_URL}/${id}`, authHeaders());
};

export const markTodoComplete = async (id) => {
  return updateTodo(id, { status: 'COMPLETE' });
};

export const markTodoExpired = async (id) => {
  return updateTodo(id, { status: 'EXPIRED' });
};
