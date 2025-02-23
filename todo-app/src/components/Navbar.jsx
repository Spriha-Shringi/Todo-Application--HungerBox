import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { resetPassword } from '../api/authApi';



const PasswordResetModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user} = useContext(AuthContext);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
  
    try {
      console.log(newPassword);
      console.log("User object:", user);

      await resetPassword(user.username, newPassword);
      console.log(newPassword);
      alert('Password reset successful!');
      onClose();
    } catch (error) {
      alert('Failed to reset password. Try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Reset Password</h3>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button 
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showResetModal, setShowResetModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="bg-gradient-to-r from-[#004687] to-[#0a0047] p-4 text-white w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-[#00ffd2] font-bold text-xl">Todo App</div>
          <div className="flex items-center gap-4">
            <span className="text-[#00ffd2]">Welcome, {user.username}</span>
            <button 
              onClick={() => setShowResetModal(true)}
              className="bg-[#004687] text-white px-4 py-2 rounded hover:bg-[#003666] transition-colors"
            >
              Reset Password
            </button>
            <button 
              onClick={logout}
              className="bg-[#ff4499] text-white px-4 py-2 rounded hover:bg-[#ff3388] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <PasswordResetModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
};

export default Navbar;