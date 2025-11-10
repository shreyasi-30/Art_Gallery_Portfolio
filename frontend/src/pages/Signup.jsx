import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaRocket, FaPalette } from 'react-icons/fa';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-artwork">
            <div className="artwork-circle circle-1"></div>
            <div className="artwork-circle circle-2"></div>
            <div className="artwork-circle circle-3"></div>
            <div className="signup-left-content">
              <FaPalette className="hero-icon" />
              <h1>Join the Creative Community</h1>
              <p>Showcase your art to the world and connect with fellow artists</p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Upload unlimited artworks</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Build your portfolio</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Get discovered by art lovers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Start your artistic journey today</p>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaLock className="input-icon" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  className="form-input"
                  minLength="6"
                />
                <span className="password-hint">Minimum 6 characters</span>
              </div>

              <button 
                type="submit" 
                className="signup-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaRocket /> Create Account
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                Already have an account? 
                <Link to="/login" className="login-link">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;