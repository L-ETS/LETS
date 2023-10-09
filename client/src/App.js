import './App.css';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import React from 'react';
import UploadProduct from './pages/trade/UploadProduct';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/user/register' element={<Register/>} />
      <Route path='/user/mypage' element={<MyPage/>} />

      <Route path='/trade/upload' element={<UploadProduct/>} />
    </Routes>
  );
}

export default App;