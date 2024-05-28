import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cars from './components/Cars';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container p-4">
        <Routes>
          <Route exact path="/" element={<Cars />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
