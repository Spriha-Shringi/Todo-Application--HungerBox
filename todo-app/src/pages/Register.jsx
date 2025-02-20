import { useState } from 'react';
import { registerUser } from '../api/authApi';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    alert("Registration Successful!")
    setError('');
    await registerUser({ username, password });
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Register</h2>
        <input
          className="w-full p-2 border rounded mb-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-4"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
}
