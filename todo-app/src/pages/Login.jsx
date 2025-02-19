import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  
  const handleLogin = async () => {
    const response = await loginUser({ username, password });
    localStorage.setItem('token', response.token);
    window.location.href = '/tasks';
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0047' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30"
           style={{ background: 'linear-gradient(45deg, #00ffd2, #004687)' }}></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-20"
           style={{ background: 'linear-gradient(45deg, #ff4499, #004687)' }}></div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#00ffd2' }}>
            Welcome to the TODO Application
          </h1>
          <div className="text-xl" style={{ color: '#ff4499' }}>
            Created by Spriha Shringi
          </div>
          <div className="text-gray-400 mt-2">
            Student at The LNM Institute of Information Technology
          </div>
        </header>

        {showLogin ? (
          <div className="max-w-md mx-auto p-6 rounded-xl shadow-2xl" 
               style={{ background: 'rgba(0, 70, 135, 0.9)' }}>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Login</h2>
            <input
              className="w-full p-2 border rounded mb-2 bg-white/90"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-4 bg-white/90"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full p-2 rounded font-semibold transition-colors"
              style={{ 
                background: '#00ffd2',
                color: '#0a0047'
              }}
              onClick={handleLogin}
            >
              Login
            </button>
            
            {/* Password Reset Link */}
            {/* <button
              className="w-full mt-2 text-white text-sm hover:underline"
              onClick={() => setShowResetForm(true)}
            >
              Forgot Password?
            </button> */}
            
            {/* Register Link */}
            <div className="mt-4 text-center">
              <Link 
                to="/register" 
                className="text-white hover:text-[#00ffd2] transition-colors"
              >
                Don't have an account? Register here
              </Link>
            </div>
            
            <button
              className="w-full mt-4 text-black text-sm"
              onClick={() => setShowLogin(false)}
            >
              Back to Intro
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              className="px-8 py-3 rounded-lg font-semibold text-lg transition-transform hover:scale-105"
              style={{ 
                background: '#00ffd2',
                color: '#0a0047'
              }}
              onClick={() => setShowLogin(true)}
            >
              Get Started
            </button>
          </div>
        )}

        <footer className="absolute bottom-4 left-0 right-0 text-center text-gray-400">
          <div>© {new Date().getFullYear()} All rights reserved.</div>
          <div className="text-sm mt-1">Designed on February 19, 2025</div>
        </footer>
      </div>
    </div>
  );
};

export default Login;