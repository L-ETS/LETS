import './App.css';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Upload from './pages/Upload';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import React from 'react';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/user/register' element={<Register/>} />
      <Route path='/user/mypage' element={<MyPage/>} />
      <Route path='/posts/upload' element={<Upload/>} />
      <Route path='/posts/:postId' element={<PostDetail/>}/>
      <Route path='/posts/:postId/edit' element={<EditPost/>}/>
      <Route path='/chat/:room_uuid' element={<Chat/>}/>
      <Route path='/user/chatlist' element={<ChatList/>}/>
    </Routes>
  );
}

export default App;