import React, { useState } from 'react';
import "./DonateBlood.css";
import logo from '../../assets/logo.jpg';

const DonateBloodForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!firstName || !lastName || !phone || !email || !dateOfBirth || !gender || !bloodGroup || !address) {
            setError('All fields are required');
            return;
        }
        
        const data = { first_name: firstName, last_name: lastName, phone, email, date_of_birth: dateOfBirth, gender, blood_group: bloodGroup, address };

        try {
            const response = await fetch('http://127.0.0.1:8000/donate/donateblood/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Donation request was successful!');
                setError('');

                // Reset form fields after successful submission
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
                setDateOfBirth('');
                setGender('');
                setBloodGroup('');
                setAddress('');
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
        <div className="donate-container">
            <div className="cll">
                <h1>Donate Blood</h1>
            </div>
            <div className="donate-content">
                <div className="left-right-container">
                    <div className="left-section">
                        <img src={logo} alt="Hamro LifeBank Logo" className="logo" />
                    </div>

                    <div className="right-section">
                        <h2>Please send us your details</h2>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <form className='donateform' onSubmit={handleSubmit}>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            
                            <div className="select-group">
                                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                                    <option value="">Blood Group</option>
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
                            
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            
                            <button className="donatebtn" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonateBloodForm;
