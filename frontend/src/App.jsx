// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonationStartPage from './components/DonationStartPage';
import DonationForm from './components/DonationForm';

function App() {
    return (
        <Router>
            <Routes>
                
                <Route path="/" element={<DonationStartPage />} />
                <Route path="/donation-form" element={<DonationForm />} />
            </Routes>
        </Router>
    );
}

export default App;
