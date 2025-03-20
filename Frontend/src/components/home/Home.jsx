import React from "react";
import { Heart, Droplets, Phone, Users } from 'lucide-react';
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="home-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1 className="header-title">
            <span className="highlight">Donate Blood Today</span>
            <br />
            <span className="subtitle">
              Help Save Lives Tomorrow – Your Gift Can Make a Difference
            </span>
          </h1>
          <div className="header-buttons">
            <button className="primary-btn" onClick={() => navigate("/donate-blood")}>
              Donate Blood
            </button>
            <button className="secondary-btn" onClick={() => navigate("/request-blood")}>
              Request Blood
            </button>
          </div>
        </div>
      </header> {/* ✅ Fixed closing tag */}

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="section-grid">
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1000"
              alt="Blood Donation Process"
              className="section-image"
            />
          </div>
          <div className="content-container">
            <h2 className="section-title">Why Choose Itahari Life Bank?</h2>
            <p className="section-text">
              Itahari Life Bank is dedicated to saving lives by addressing critical blood shortages 
              in hospitals, particularly during emergencies, surgeries, and childbirth. We ensure 
              a reliable blood supply reaches even the most remote areas, making timely care 
              accessible to all patients in need.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <Heart className="feature-icon" />
                <span>24/7 Support</span>
              </div>
              <div className="feature-item">
                <Droplets className="feature-icon" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <div className="section-grid">
          <div className="content-container">
            <h2 className="section-title">What We Do?</h2>
            <p className="section-text">
              With advanced blood data management systems, we work closely with blood banks 
              to maintain accurate information and efficiently recruit, engage, and retain donors 
              based on demand. We provide real-time blood availability information to those in 
              need, ensuring quick and reliable access to life-saving resources.
            </p>
          </div>
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000"
              alt="Blood Bank Operations"
              className="section-image"
            />
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-card">
            <Phone className="card-icon" />
            <h3 className="card-title">Ragat Chahiyo Hotline</h3>
            <p className="card-subtitle">24/7 Emergency Support</p>
            <p className="card-phone">29837459827</p>
          </div>
          <div className="contact-card">
            <Users className="card-icon" />
            <h3 className="card-title">Donor Community</h3>
            <p className="card-text">
              Join our vein-to-vein initiative and become part of our life-saving community.
              We motivate and support donors throughout their journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
