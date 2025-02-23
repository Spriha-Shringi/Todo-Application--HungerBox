import React from 'react';
import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0047 0%, #004687 100%)' }}>

      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-4xl font-bold" style={{ color: '#00ffd2' }}>
          Portfolio
        </h1>
        <nav className="flex gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2 rounded-full text-lg transition-all duration-300 hover:scale-105"
            style={{ background: '#00ffd2', color: '#0a0047' }}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 rounded-full text-lg transition-all duration-300 hover:scale-105"
            style={{ background: '#ff4499', color: 'white' }}
          >
            Register
          </Link>
        </nav>
      </header>


      <section className="text-center py-20 px-10">
        <h2 className="text-6xl font-extrabold mb-8" style={{ color: '#00ffd2' }}>
          Welcome
        </h2>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#ff4499' }}>
            Created by Spriha Shringi
          </h3>
          <p className="text-xl mb-6">
            Student at The LNM Institute of Information Technology
          </p>
          {/* <Link
            to="/tasks"
            className="inline-block px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ background: '#00ffd2', color: '#0a0047' }}
          >
            View Tasks
          </Link> */}
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl shadow-lg" style={{ background: 'rgba(0, 255, 210, 0.1)' }}>
            <h4 className="text-2xl font-bold mb-3" style={{ color: '#00ffd2' }}>Projects</h4>
            <p>Explore my portfolio of creative and technical projects.</p>
          </div>
          <div className="p-6 rounded-xl shadow-lg" style={{ background: 'rgba(255, 68, 153, 0.1)' }}>
            <h4 className="text-2xl font-bold mb-3" style={{ color: '#ff4499' }}>Skills</h4>
            <p>Discover my technical expertise and capabilities.</p>
          </div>
          <div className="p-6 rounded-xl shadow-lg" style={{ background: 'rgba(0, 70, 135, 0.1)' }}>
            <h4 className="text-2xl font-bold mb-3" style={{ color: '#00ffd2' }}>Experience</h4>
            <p>Learn about my professional journey and achievements.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 mt-auto">
        <p className="text-lg">
          February 19, 2025
        </p>
        <p className="text-sm mt-2 opacity-75">
          © 2025 All Rights Reserved
        </p>
      </footer>


      <div className="fixed top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-xl"
           style={{ background: '#00ffd2', zIndex: 10 }} />
      <div className="fixed bottom-0 right-0 w-64 h-64 rounded-full opacity-20 blur-xl"
           style={{ background: '#ff4499', zIndex: 10 }} />
    </div>
  );
};

export default Intro;