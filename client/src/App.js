import './App.css';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/user/register' element={<Register/>} />
    </Routes>
  );
}

export default App;