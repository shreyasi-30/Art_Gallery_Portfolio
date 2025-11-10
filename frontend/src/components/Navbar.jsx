import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPalette, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaPalette className="logo-icon" />
          <span>ArtGallery</span>
        </Link>

        <div className={`navbar-menu ${mobileMenu ? 'active' : ''}`}>
          <Link to="/gallery" className="nav-link" onClick={() => setMobileMenu(false)}>
            Gallery
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenu(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setMobileMenu(false)}>
                <FaUser /> Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMobileMenu(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileMenu(false)}>
                <button className="btn btn-primary btn-sm">Get Started</button>
              </Link>
            </>
          )}
        </div>

        <div className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;