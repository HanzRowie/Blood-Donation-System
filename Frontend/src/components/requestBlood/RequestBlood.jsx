import React, { useState } from 'react';
import "./RequestBlood.css";
import { User, Phone, Mail, MapPin, FileText, Users, Droplet } from 'lucide-react';

const RequestBloodForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !phone || !email || !address || !gender || !bloodGroup || !note) {
            setError('⚠️ All fields are required');
            return;
        }

        const data = {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            note: note,
            gender: gender,
            blood_group: bloodGroup,
            address: address,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/donate/requestblood/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.status === 201) {
                setSuccess('✅ Blood request submitted successfully!');
                setError('');
                
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setGender('');
                setBloodGroup('');
                setNote('');
            } else {
                setError(`⚠️ ${responseData.error || 'Something went wrong'}`);
                setSuccess('');
            }
        } catch (err) {
            setError('⚠️ Error connecting to the server');
            setSuccess('');
        }
    };

    return (
        <div className="blood-request-container">
            <div className="blood-request-header">
                <h1>Request Blood</h1>
                <p>Your request for blood donation could save a life. Please fill out the form below with accurate information.</p>
            </div>
            
            <div className="blood-request-wrapper">
                {error && <div className="blood-request-error">{error}</div>}
                {success && <div className="blood-request-success">{success}</div>}
                
                <form onSubmit={handleSubmit} className="blood-request-form">
                    <div className="blood-request-grid">
                        <div className="blood-request-column">
                            <div className="blood-request-group">
                                <label className="blood-request-label"><User size={18} /> First Name</label>
                                <div className="blood-request-input-wrapper">
                                  
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                        className="blood-request-input"
                                    />
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><User size={18} /> Last Name</label>
                                <div className="blood-request-input-wrapper">
                                  
                                    <input 
                                        type="text" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter your last name"
                                        className="blood-request-input"
                                    />
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><Phone size={18} /> Phone</label>
                                <div className="blood-request-input-wrapper">
                                  
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="blood-request-input"
                                    />
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><Mail size={18} /> Email</label>
                                <div className="blood-request-input-wrapper">
                                    
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="blood-request-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="blood-request-column">
                            <div className="blood-request-group">
                                <label className="blood-request-label"><FileText size={18} /> Note</label>
                                <div className="blood-request-input-wrapper blood-request-textarea-wrapper">
                                 
                                    <textarea 
                                        value={note} 
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Please provide any additional information or specific requirements"
                                        className="blood-request-textarea"
                                    />
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><Users size={18} /> Gender</label>
                                <div className="blood-request-input-wrapper">
                                  
                                    <select 
                                        value={gender} 
                                        onChange={(e) => setGender(e.target.value)}
                                        className="blood-request-select"
                                    >
                                        <option value="">Select your gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><Droplet size={18} /> Blood Group</label>
                                <div className="blood-request-input-wrapper">
                                    
                                    <select 
                                        value={bloodGroup} 
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="blood-request-select"
                                    >
                                        <option value="">Select blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>

                            <div className="blood-request-group">
                                <label className="blood-request-label"><MapPin size={18} /> Address</label>
                                <div className="blood-request-input-wrapper">
                                   
                                    <input 
                                        type="text" 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your complete address"
                                        className="blood-request-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="blood-request-submit">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestBloodForm;