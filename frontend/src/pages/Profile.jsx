import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUser, FaCamera, FaSave, FaGlobe, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    website: user?.website || '',
    instagram: user?.socialLinks?.instagram || '',
    twitter: user?.socialLinks?.twitter || '',
    facebook: user?.socialLinks?.facebook || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('bio', profileData.bio);
    formData.append('website', profileData.website);
    formData.append('instagram', profileData.instagram);
    formData.append('twitter', profileData.twitter);
    formData.append('facebook', profileData.facebook);
    
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    try {
      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage('Profile updated successfully!');
      setEditing(false);
      setSelectedFile(null);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-header">
        <div className="container">
          <div className="profile-banner">
            <div className="profile-avatar-section">
              <div className="profile-avatar-container">
                {previewUrl ? (
                  <img src={previewUrl} alt={user?.name} className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <FaUser />
                  </div>
                )}
                {editing && (
                  <label className="avatar-upload-btn">
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      hidden
                    />
                  </label>
                )}
              </div>
              <div className="profile-info">
                <h1>{user?.name}</h1>
                <p>{user?.email}</p>
              </div>
            </div>
            {!editing && (
              <button 
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container profile-content">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself and your art..."
                />
              </div>

              <div className="form-group">
                <label>
                  <FaGlobe /> Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Social Links</h2>
              
              <div className="form-group">
                <label>
                  <FaInstagram /> Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={profileData.instagram}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaTwitter /> Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={profileData.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaFacebook /> Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={profileData.facebook}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setSelectedFile(null);
                  setPreviewUrl(user?.profileImage || '');
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-section">
              <h2>About</h2>
              <p className="bio-text">
                {user?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
              </p>
            </div>

            {(user?.website || user?.socialLinks?.instagram || user?.socialLinks?.twitter || user?.socialLinks?.facebook) && (
              <div className="profile-section">
                <h2>Connect</h2>
                <div className="social-links">
                  {user?.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaGlobe /> Website
                    </a>
                  )}
                  {user?.socialLinks?.instagram && (
                    <a 
                      href={`https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link instagram"
                    >
                      <FaInstagram /> Instagram
                    </a>
                  )}
                  {user?.socialLinks?.twitter && (
                    <a 
                      href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link twitter"
                    >
                      <FaTwitter /> Twitter
                    </a>
                  )}
                  {user?.socialLinks?.facebook && (
                    <a 
                      href={`https://facebook.com/${user.socialLinks.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link facebook"
                    >
                      <FaFacebook /> Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
