import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Rumsan Logo" className="main-logo" />
          <p className="company-description">
            Rumsan is a diversified multi-business company. We are committed to supporting promising start-ups and investing in digital innovation.
          </p>
         
        </div>
        <div className="footer-contact">
          <h4>Contact Info</h4>
          <ul>
            <li><strong>Address:</strong> Itahari-4, Nepal</li>
            <li><strong>Phone:</strong> +977 9801230045</li>
            <li><strong>Email:</strong> <a href="mailto:team@Itahari@gmail.com">team@Itahari@gmail.com</a></li>
          </ul>
        </div>
        <div className="footer-resources">
          <h4>Resources</h4>
          <ul>
            <li>Blood basics</li>
            <li>Blood bank information</li>
            <li>When you need blood</li>
          </ul>
        </div>
        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to our Newsletter and get the latest updates about Hamro Lifebank.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email Address" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Rumsan | All rights reserved | <a href="#">Privacy Policy</a></p>
      </div>
    </footer>
  );
};

export default Footer;
