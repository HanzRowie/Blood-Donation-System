import React, { useState } from 'react';
import "./RequestBlood.css";

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
            setError('All fields are required');
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
                setSuccess('Blood request submitted successfully!');
                setError('');
            } else {
                setError(responseData.error || 'Something went wrong');
                setSuccess('');
            }
        } catch (err) {
            setError('Error connecting to the server');
            setSuccess('');
        }
    };

    return (
        <div className="form-containerrequest">
            
            <div className="req-div">
            <h2 className="title">Request Blood Form</h2>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form className= "rqform"  onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="left-section">
                        <label>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        
                        <label>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        
                        <label>Phone</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    
                    <div className="right-section">
                        <label>Note</label>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                        
                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        
                        <label>Blood Group</label>
                        <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                
                <button type="submit" className="submit-btn">Request Blood</button>
            </form>
        </div>
    );
};

export default RequestBloodForm;
