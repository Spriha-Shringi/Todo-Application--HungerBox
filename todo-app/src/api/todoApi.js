import axios from 'axios';
import { getToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL + "/api/todos"; // Use Vite env variable

const authHeaders = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
};

export const getTodos = async () => {
  const headers = authHeaders();
  if (!headers) {
    console.warn("Skipping API request: No token available.");
    return [];
  }

  try {
    const response = await axios.get(API_URL, headers);
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
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`, authHeaders());
};

export const markTodoComplete = async (id) => updateTodo(id, { status: 'COMPLETE' });
export const markTodoExpired = async (id) => updateTodo(id, { status: 'EXPIRED' });
