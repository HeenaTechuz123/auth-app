import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { businessService } from "../../services/businessService";
import "./BusinessList.scss";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    industry: "all",
    location: "all"
  });
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadBusinesses();
    loadFilterOptions();
  }, [filters]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessService.getAllBusinesses(filters);
      
      if (response.success) {
        setBusinesses(response.data);
      } else {
        setError("Failed to load businesses");
      }
    } catch (err) {
      setError("Error loading businesses: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [industriesRes, locationsRes] = await Promise.all([
        businessService.getIndustries(),
        businessService.getLocations()
      ]);

      if (industriesRes.success) {
        setIndustries(industriesRes.data);
      }
      
      if (locationsRes.success) {
        setLocations(locationsRes.data);
      }
    } catch (err) {
      console.error("Error loading filter options:", err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search will be triggered by useEffect when filters change
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="business-list">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading businesses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-list">
        <div className="container">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={loadBusinesses} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-list">
      <div className="container">
        <div className="page-header">
          <h1>Business Directory</h1>
          <p>Discover innovative companies and their services</p>
        </div>

        <div className="filters-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search businesses, services, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="industry">Industry:</label>
              <select
                id="industry"
                value={filters.industry}
                onChange={(e) => handleFilterChange("industry", e.target.value)}
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location:</label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>Showing {businesses.length} businesses</p>
        </div>

        <div className="businesses-grid">
          {businesses.map(business => (
            <div key={business.id} className="business-card">
              <div className="business-header">
                <img src={business.logo} alt={business.name} className="business-logo" />
                <div className="business-info">
                  <h3>{business.name}</h3>
                  <p className="industry">{business.industry}</p>
                  <div className="rating">
                    {renderStars(business.rating)}
                    <span className="rating-value">({business.rating})</span>
                  </div>
                </div>
              </div>

              <div className="business-content">
                <p className="description">{business.description}</p>
                
                <div className="business-details">
                  <div className="detail-item">
                    <strong>Founded:</strong> {business.founded}
                  </div>
                  <div className="detail-item">
                    <strong>Employees:</strong> {business.employees}
                  </div>
                  <div className="detail-item">
                    <strong>Location:</strong> {business.location}
                  </div>
                  <div className="detail-item">
                    <strong>Revenue:</strong> {business.revenue}
                  </div>
                </div>

                <div className="services">
                  <strong>Services:</strong>
                  <div className="services-tags">
                    {business.services.map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>

                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Website:</strong> 
                    <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer">
                      {business.website}
                    </a>
                  </div>
                  <div className="contact-item">
                    <strong>Email:</strong> 
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </div>
                  <div className="contact-item">
                    <strong>Phone:</strong> 
                    <a href={`tel:${business.phone}`}>{business.phone}</a>
                  </div>
                </div>
              </div>

              <div className="business-actions">
                <Link to={`/business/${business.id}`} className="view-details-btn">
                  View Details
                </Link>
                <a 
                  href={`https://${business.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="visit-website-btn"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>

        {businesses.length === 0 && (
          <div className="no-results">
            <h3>No businesses found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}