import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaImage } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'Painting',
    medium: '',
    dimensions: '',
    price: '',
    isForSale: false,
    tags: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Painting', 'Digital Art', 'Photography', 'Sculpture', 'Mixed Media', 'Other'];

  useEffect(() => {
    fetchUserArtworks();
  }, []);

  const fetchUserArtworks = async () => {
    try {
      const response = await api.get('/artworks/user/my-artworks');
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    Object.keys(uploadData).forEach(key => {
      formData.append(key, uploadData[key]);
    });

    try {
      await api.post('/artworks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowUploadModal(false);
      resetForm();
      fetchUserArtworks();
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await api.delete(`/artworks/${id}`);
        fetchUserArtworks();
      } catch (error) {
        console.error('Error deleting artwork:', error);
      }
    }
  };

  const resetForm = () => {
    setUploadData({
      title: '',
      description: '',
      category: 'Painting',
      medium: '',
      dimensions: '',
      price: '',
      isForSale: false,
      tags: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Manage your artwork portfolio</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <FaPlus /> Upload Artwork
            </button>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <FaImage />
            </div>
            <div className="stat-details">
              <h3>{artworks.length}</h3>
              <p>Total Artworks</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaHeart />
            </div>
            <div className="stat-details">
              <h3>{artworks.reduce((sum, art) => sum + (art.likes?.length || 0), 0)}</h3>
              <p>Total Likes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaEye />
            </div>
            <div className="stat-details">
              <h3>{artworks.reduce((sum, art) => sum + (art.views || 0), 0)}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>

        <div className="artworks-section">
          <h2>Your Artworks</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your artworks...</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="empty-artworks">
              <div className="empty-icon">🎨</div>
              <h3>No artworks yet</h3>
              <p>Start building your portfolio by uploading your first artwork!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                <FaPlus /> Upload Your First Artwork
              </button>
            </div>
          ) : (
            <div className="dashboard-artworks-grid">
              {artworks.map(artwork => (
                <div key={artwork._id} className="dashboard-artwork-card">
                  <div className="artwork-thumbnail">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                    <div className="artwork-actions">
                      <Link to={`/artwork/${artwork._id}`}>
                        <button className="btn-icon" title="View">
                          <FaEye />
                        </button>
                      </Link>
                      <button 
                        className="btn-icon btn-danger" 
                        onClick={() => handleDelete(artwork._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="artwork-details">
                    <h4>{artwork.title}</h4>
                    <p className="artwork-category">{artwork.category}</p>
                    <div className="artwork-stats">
                      <span><FaHeart /> {artwork.likes?.length || 0}</span>
                      <span><FaEye /> {artwork.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Artwork</h2>
              <button 
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="upload-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="file-upload-area">
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                    <button 
                      type="button"
                      className="change-image-btn"
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <label htmlFor="file-input" className="file-upload-label">
                    <FaImage className="upload-icon" />
                    <p>Click to upload or drag and drop</p>
                    <span>PNG, JPG, GIF up to 5MB</span>
                  </label>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  hidden
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Give your artwork a title"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={uploadData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={uploadData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your artwork..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Medium</label>
                  <input
                    type="text"
                    name="medium"
                    value={uploadData.medium}
                    onChange={handleInputChange}
                    placeholder="Oil, Acrylic, Digital, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={uploadData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 x 36 inches"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={uploadData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isForSale"
                      checked={uploadData.isForSale}
                      onChange={handleInputChange}
                    />
                    <span>Available for sale</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={uploadData.tags}
                  onChange={handleInputChange}
                  placeholder="abstract, modern, landscape"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;