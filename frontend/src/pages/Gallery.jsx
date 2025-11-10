import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { FaHeart, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import './Gallery.css';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Painting', 'Digital Art', 'Photography', 'Sculpture', 'Mixed Media', 'Other'];

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await api.get('/artworks');
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artist?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <Navbar />
      
      <div className="gallery-header">
        <div className="container">
          <h1>Explore Artworks</h1>
          <p>Discover amazing creations from talented artists around the world</p>
          
          <div className="gallery-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search artworks or artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="category-filter">
              <FaFilter className="filter-icon" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container gallery-content">
        {filteredArtworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h2>No artworks found</h2>
            <p>
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to share your artwork!'}
            </p>
            <Link to="/dashboard">
              <button className="btn btn-primary">Upload Artwork</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="results-count">
              Showing {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
            </div>
            
            <div className="artworks-grid">
              {filteredArtworks.map(artwork => (
                <div key={artwork._id} className="artwork-card">
                  <div className="artwork-image-container">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title}
                      className="artwork-image"
                    />
                    <div className="artwork-overlay">
                      <Link to={`/artwork/${artwork._id}`}>
                        <button className="btn btn-primary">View Details</button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <div className="artist-info">
                      {artwork.artist?.profileImage ? (
                        <img 
                          src={artwork.artist.profileImage} 
                          alt={artwork.artist.name}
                          className="artist-avatar"
                        />
                      ) : (
                        <div className="artist-avatar-placeholder">
                          {artwork.artist?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span className="artist-name">{artwork.artist?.name || 'Unknown Artist'}</span>
                    </div>
                    
                    <div className="artwork-meta">
                      <span className="meta-item">
                        <FaHeart /> {artwork.likes?.length || 0}
                      </span>
                      <span className="meta-item">
                        <FaEye /> {artwork.views || 0}
                      </span>
                      <span className="category-badge">{artwork.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;