import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.jpg'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="pa" alt="Rumsan Logo" />
          <p className="company-description">
            Rumsan is a diversified multi-business company. We are committed to supporting promising start-ups and investing in digital innovation.
          </p>
          <div className="footer-brands">
           <img src={logo} alt="Logo" />
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="footer-contact">
          <h4>Contact Info</h4>
          <ul>
            <li><strong>Address:</strong> Itahari-4, Nepal</li>
            <li><strong>US Address:</strong> 12723 GORMAN CIR BOYDS, MD 20841</li>
            <li><strong>Phone:</strong> +977 9801230045</li>
            <li><strong>Email:</strong> <a href="mailto:team@hamrolifebank.com">team@Itahari@gmail.com</a></li>
          </ul>
        </div>
        <div className="footer-resources">
          <h4>Resources</h4>
          <ul>
            <li>Blood basics</li>
            <li>Blood bank information</li>
            <li>When you need blood</li>
            <li>Reports</li>
            <li>Videos</li>
            <li>Media Kit</li>
          </ul>
        </div>
        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to our Newsletter and get the latest updates about Hamro Lifebank.</p>
          <input type="email" placeholder="Email Address" />
          <button className="subscribe-btn">Subscribe</button>
          <div className="social-icons">
            <a href="facebook_link"><i className="fab fa-facebook-f"></i></a>
            <a href="instagram_link"><i className="fab fa-instagram"></i></a>
            <a href="linkedin_link"><i className="fab fa-linkedin-in"></i></a>
            <a href="twitter_link"><i className="fab fa-twitter"></i></a>
            <a href="youtube_link"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2025 Rumsan | All rights reserved | Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
