import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DonationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    amount: '',
    receipt: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [donorName, setDonorName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.amount.match(/^\d+(\.\d{1,2})?$/)) {
      errors.amount = 'Invalid amount format';
    }
    if (!formData.receipt) {
      errors.receipt = 'Receipt is required';
    } else if (formData.receipt.size > 5242880) {
      errors.receipt = 'File size exceeds 5MB';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const formDataObj = new FormData();
        for (const key in formData) {
          formDataObj.append(key, formData[key]);
        }
        const response = await axios.post('http://receipt.kshitiksha.xyz/donation-form', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setDonorName(formData.name); // Set donor name for modal message
        setShowModal(true);
      } catch (error) {
        console.error('Donation Failed', error.response ? error.response.data : 'Server error');
        setFormErrors({ form: 'Failed to submit donation.' });
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-300 via-cyan-100 to-cyan-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mt-16 mb-8">
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="text-center text-lg font-semibold mb-2 text-cyan-600">
                Submission Confirmation
              </h2>
              <p className="text-lg mb-4 font-medium">Thank you, {donorName}, for your generous donation!</p>
              <button onClick={handleCloseModal} className="close-btn">
                Close
              </button>
            </div>
            <style jsx>{`
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 1000;
              }
              .modal-content {
                padding: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                width: 300px;
              }
              .close-btn {
                display: inline-block;
                padding: 8px 15px;
                margin-top: 15px;
                font-size: 16px;
                color: white;
                background-color: #007bff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
              }
              .close-btn:hover {
                background-color: #0056b3;
              }
            `}</style>
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-800 my-4 mb-2 uppercase">
            Donation Receipt
          </h1>
          <p className="text-rose-600 uppercase mt-4 mb-8 font-semibold">
            Kshitiksha Foundation 🍁
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          <InputField
            name="email"
            label="E-Mail"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />
          <InputField
            name="city"
            label="City"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            error={formErrors.city}
          />
          <InputField
            name="amount"
            label="Amount Donated"
            placeholder="Enter amount donated"
            value={formData.amount}
            onChange={handleChange}
            error={formErrors.amount}
          />
          <div>
            <label className="block text-gray-700 font-medium mb-1">Upload Receipt</label>
            <input
              type="file"
              name="receipt"
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-150"
            />
            {formErrors.receipt && (
              <p className="text-red-600 mt-1">{formErrors.receipt} <span className="text-xl">❗</span></p>
            )}
          </div>
          {formErrors.form && (
            <p className="text-red-600 mt-1">{formErrors.form} <span className="text-xl">❗</span></p>
          )}
          <button
            type="submit"
            className="btn bg-purple-700 hover:bg-purple-800 w-full rounded-full text-white py-2 transition duration-150"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ name, label, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-150"
        value={value}
        onChange={onChange}
        required
      />
      {error && (
        <p className="text-red-600 mt-1">{error} <span className="text-xl">❗</span></p>
      )}
    </div>
  );
}

export default DonationForm;
