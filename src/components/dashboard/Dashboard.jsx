import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import bannerImg from "../../assets/images/bnnner-right.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User"; // ✅ fetch stored name

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken"); // if you plan to use token later
    navigate("/");
  };
  
   const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // State to hold validation error messages
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

      // Validate form fields
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop form submission
    }
    
    setIsSending(true);
    setStatus('');
    

    try {
      const response = await fetch('http://localhost:5001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 2000);  

        setStatus(data.message + ' ✅');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form

     

      } else {
        setStatus(data.message + ' ❌');
      }
    } catch (error) {
      setStatus('Failed to connect to the server. Please try again later. ❌');
    } finally {
      setIsSending(false);
    }
  };

  // Check if any form fields have an error
 const hasErrors = Object.values(errors).some(error => error);

  return (
    <div className="home-page">
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="success-icon">✓</div>
            <h3>Email Send Successfully!</h3>
          </div>
        </div>
      )}
      <section className="banner flight-booking-banner">
        <div className="container">
          <div className="flight-booking-demo">
            <div className="booking-header">
              <h1>Find Your Perfect Flight</h1>
              <p>Search millions of flights and get the best deals instantly</p>
            </div>

            <div className="booking-form-container">
              {/* <div className="booking-tabs">
                <button className="tab-btn active">✈️ Flights</button>
                <button className="tab-btn">🏨 Hotels</button>
                <button className="tab-btn">🚗 Cars</button>
              </div> */}

              <div className="flight-booking-form">
                <div className="trip-type-selector">
                  <label className="trip-option">
                    <input type="radio" name="tripType" value="roundTrip" defaultChecked />
                    <span>Round Trip</span>
                  </label>
                  <label className="trip-option">
                    <input type="radio" name="tripType" value="oneWay" />
                    <span>One Way</span>
                  </label>
                  <label className="trip-option">
                    <input type="radio" name="tripType" value="multiCity" />
                    <span>Multi City</span>
                  </label>
                </div>

                <div className="booking-inputs">
                  <div className="input-group location-inputs">
                    <div className="input-field from-field">
                      <label>From</label>
                      <div className="input-with-icon">
                        <span className="input-icon">🛫</span>
                        <input type="text" placeholder="New York (NYC)" defaultValue="New York (NYC)" />
                      </div>
                    </div>
                    
                    <button className="swap-btn">⇄</button>
                    
                    <div className="input-field to-field">
                      <label>To</label>
                      <div className="input-with-icon">
                        <span className="input-icon">🛬</span>
                        <input type="text" placeholder="Los Angeles (LAX)" defaultValue="Los Angeles (LAX)" />
                      </div>
                    </div>
                  </div>

                  <div className="input-group date-passenger-inputs">
                    <div className="input-field date-field">
                      <label>Departure</label>
                      <div className="input-with-icon">
                        <span className="input-icon">📅</span>
                        <input type="date" defaultValue="2025-09-15" />
                      </div>
                    </div>

                    <div className="input-field date-field">
                      <label>Return</label>
                      <div className="input-with-icon">
                        <span className="input-icon">📅</span>
                        <input type="date" defaultValue="2025-09-22" />
                      </div>
                    </div>

                    <div className="input-field passenger-field">
                      <label>Travelers</label>
                      <div className="input-with-icon">
                        <span className="input-icon">👥</span>
                        <select defaultValue="1">
                          <option value="1">1 Adult</option>
                          <option value="2">2 Adults</option>
                          <option value="3">3 Adults</option>
                          <option value="4">4+ Adults</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-field class-field">
                      <label>Class</label>
                      <div className="input-with-icon">
                        <span className="input-icon">💺</span>
                        <select defaultValue="economy">
                          <option value="economy">Economy</option>
                          <option value="premium">Premium</option>
                          <option value="business">Business</option>
                          <option value="first">First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="search-flights-btn">
                  <span>🔍</span>
                  Search Flights
                </button>
              </div>

              {/* <div className="quick-destinations">
                <h3>Popular Destinations</h3>
                <div className="destination-cards">
                  <div className="destination-card">
                    <div className="destination-flag">🇫🇷</div>
                    <div className="destination-info">
                      <span className="city">Paris</span>
                      <span className="country">France</span>
                    </div>
                    <span className="price">from $649</span>
                  </div>
                  <div className="destination-card">
                    <div className="destination-flag">🇯🇵</div>
                    <div className="destination-info">
                      <span className="city">Tokyo</span>
                      <span className="country">Japan</span>
                    </div>
                    <span className="price">from $899</span>
                  </div>
                  <div className="destination-card">
                    <div className="destination-flag">🇬🇧</div>
                    <div className="destination-info">
                      <span className="city">London</span>
                      <span className="country">UK</span>
                    </div>
                    <span className="price">from $549</span>
                  </div>
                  <div className="destination-card">
                    <div className="destination-flag">🇦🇪</div>
                    <div className="destination-info">
                      <span className="city">Dubai</span>
                      <span className="country">UAE</span>
                    </div>
                    <span className="price">from $749</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features for Your Success</h2>
            <p>Everything you need to manage your business and collaborate with your team</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>User Management</h3>
              <p>Secure authentication system with profile management and password protection.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Business Directory</h3>
              <p>Comprehensive business listing with search, filtering, and detailed company profiles.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Built with modern security practices including encrypted passwords and secure sessions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Responsive</h3>
              <p>Lightning-fast performance with real-time updates and responsive design.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data Management</h3>
              <p>Powerful database integration with MySQL for reliable data storage and retrieval.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface designed for productivity with minimal learning curve.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Ready to streamline your business operations? Contact us today to learn more about our platform.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>contact@whitepace.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <form noValidate onSubmit={handleSubmit}>
                <div className="form-group">
                 <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name} 
                  onChange={handleChange}
                />
               {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <input type="email" 
                  name="email"
                  placeholder="Your Email"
                   onChange={handleChange}
                  value={formData.email}
                  />
                 {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <input type="text" 
                    name="subject"
                    placeholder="Subject"
                   onChange={handleChange}
                   value={formData.subject} />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" name="message" rows="5" value={formData.message}                   
                  onChange={handleChange}></textarea>
                   {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                  <button type="submit" className="common-btn" disabled={isSending || hasErrors}>
                   {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Whitepace</h3>
              <p>Empowering teams to collaborate, plan, and achieve more together through innovative project management solutions.</p>
              <div className="social-links">
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📸</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="/businesses">Business Directory</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#integrations">Integrations</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#status">System Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
            <p>&copy; 2025 Whitepace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
