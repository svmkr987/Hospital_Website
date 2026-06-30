import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Admin from './pages/Admin.tsx';
import BookAppointment from './pages/BookAppointment.tsx';
import Contact from './pages/Contact.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/book" element={<BookAppointment />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
