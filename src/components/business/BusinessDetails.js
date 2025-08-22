import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { businessService } from "../../services/businessService";
import "./BusinessDetails.scss";

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      setError("");
      
      try {
        const result = await businessService.getBusinessById(id);
        if (result.success) {
          setBusiness(result.data);
        } else {
          setError(result.error || "Business not found");
        }
      } catch (err) {
        setError("Failed to load business details");
        console.error("Error fetching business:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/businesses");
  };

  if (loading) {
    return (
      <div className="business-details">
        <div className="container">
          <div className="loading">Loading business details...</div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="business-details">
        <div className="container">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleBack} className="back-btn">
              ← Back to Businesses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-details">
      <div className="container">
        <div className="business-header">
          <div className="header-actions">
            <button onClick={handleBack} className="back-btn">
              ← Back to Businesses
            </button>
          </div>
          <h1>{business.name}</h1>
          <p className="business-tagline">{business.description}</p>
          {business.rating && (
            <div className="business-rating">
              <span className="rating">★ {business.rating}</span>
            </div>
          )}
        </div>

        <div className="business-content">
          <div className="business-info">
            <div className="info-section">
              <h2>Company Overview</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Founded:</strong> {business.founded || "N/A"}
                </div>
                <div className="info-item">
                  <strong>Employees:</strong> {business.employees || "N/A"}
                </div>
                <div className="info-item">
                  <strong>Industry:</strong> {business.industry || "N/A"}
                </div>
                <div className="info-item">
                  <strong>Location:</strong> {business.location || "N/A"}
                </div>
                {business.revenue && (
                  <div className="info-item">
                    <strong>Revenue:</strong> {business.revenue}
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h2>Contact Information</h2>
              <div className="contact-info">
                {business.website && (
                  <div className="contact-item">
                    <strong>Website:</strong> {business.website}
                  </div>
                )}
                {business.email && (
                  <div className="contact-item">
                    <strong>Email:</strong> {business.email}
                  </div>
                )}
                {business.phone && (
                  <div className="contact-item">
                    <strong>Phone:</strong> {business.phone}
                  </div>
                )}
              </div>
            </div>

            {business.services && business.services.length > 0 && (
              <div className="info-section">
                <h2>Our Services</h2>
                <ul className="services-list">
                  {business.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}