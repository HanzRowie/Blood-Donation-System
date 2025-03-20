import React, { useState } from 'react';
import { FaFacebookSquare, FaInstagramSquare, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

import "./Contact.css";

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !address || !feedback) {
            setError('All fields are required');
            return;
        }

        const data = { name, email, address, feedback };

        try {
            const response = await fetch('http://127.0.0.1:8000/donate/donatecontact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Feedback has been send successfully');
                setError('');
                
                // Reset form fields after successful submission
                setName('');
                setEmail('');
                setAddress('');
                setFeedback('');
            } else {
                const responseData = await response.json();
                setError(responseData.error || 'Something went wrong');
                setSuccess('');
            }
        } catch (err) {
            setError('Error connecting to the server');
            setSuccess('');
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-left">
                <h5>CONTACT US</h5>
                <h1>Get in touch<br/> today</h1>
                <p>
                    We love questions and feedback – and we’re always happy to help!
                    Here are some ways to contact us.
                </p>
                <div className="contact-info">
                    <div className="contact-item">
                        <span><FaEnvelope /> Email:</span>
                        <p> contact@company.com</p>
                    </div>
                    <div className="contact-item">
                        <span><FaPhone /> Phone:</span>
                        <p>(123) 123-3213-23</p>
                    </div>
                    <div className="social-icons">
                        <p>Reach out to us on:</p>
                        <i className="fab fa-facebook"><FaFacebookSquare /></i>
                        <i className="fab fa-instagram"><FaInstagramSquare /></i>
                        <i className="fab fa-twitter"><FaTwitter/></i>
                        <i className="fab fa-linkedin"><FaLinkedin /></i>
                    </div>
                </div>
            </div>

            <div className="contact-right">
                <h1>Contact Form</h1>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <label>Leave us a message</label>
                    <textarea
                        name="feedback"
                        placeholder="Write your message here..."
                        rows="4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button className='contactbtn' type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
