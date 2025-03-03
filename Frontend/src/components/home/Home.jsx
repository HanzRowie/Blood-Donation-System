import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import imagesboy from "../../assets/imagesboy.jpg";
import images from "../../assets/images.jpg"; // Replace with actual image
import bloodimage from "../../assets/bloodimage.jpg"; 
import hands from "../../assets/hands.png"; 


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="homeh1">
          <span className="highlight">Donate Blood Today</span> and Help Save Lives Tomorrow – Your Gift Can Make a Difference.
        </h1>
        <div className="homebtn">
          <button className="home1-btn" onClick={() => navigate("/donate-blood")}>
            Donate Blood
          </button>
          <button className="home2-btn" onClick={() => navigate("/request-blood")}>
            Request Blood
          </button>
        </div>
      </header>

      <section className="main-content">
        <div className="img-container">
          <img src={imagesboy} alt="Logo" className="img" />
        </div>

        <div className="info-section">
          <h2 className="section-title">Why Itahari Life Bank?</h2>
          <p>
            Itahari Life Bank saves lives by addressing shortages in hospitals, especially during emergencies,
            surgeries, and childbirth. It solves the problem of inadequate blood supply, particularly in rural areas,
            and ensures timely care for patients in need.
          </p>
        </div>
      </section>

      {/* Updated Details Section */}
      <section className="details">
      <div className="details-text">
    <h2 className="section-title">What We Do?</h2>
    <p>
      With the right blood data management, Itahari works closely with blood banks to maintain their information and
      also recruit, engage, and retain donors as per the demand. Folks in search of blood can get access to blood
      availability info.
    </p>
  </div>
  
  <div className="details-img">
    <img src={images} alt="Blood Donation" />
  </div>
   </section>

      <section className="contact">
        <div className="contact-card">
        <div className="blood-deta">
          <img src={bloodimage} alt="Blood Donation" />
       </div>
          <h3>Ragat Chahiyo Hotline</h3>
          <p>Contact Us</p>
          <p>29837459827</p>
        </div>

        <div className="contact-card">
         <div className="bloodhands">
          <img src={hands} alt="Blood Donation" />
          </div>
          <h3>Motivate Donors</h3>
          <p>We motivate and retain donors with our vein-to-vein initiative.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
