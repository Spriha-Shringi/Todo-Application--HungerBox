import { useState } from 'react';
import { loginUser } from '../api/authApi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await loginUser({ username, password });
    localStorage.setItem('token', response.token);
    window.location.href = '/tasks';
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
        <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-2 border rounded mb-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}