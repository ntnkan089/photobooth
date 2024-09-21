import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Profile from './pages/Profile';
import Postings from './pages/Postings';

import Redirect from './pages/Redirect';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './pages/Chat';


function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/redirect" element={<Redirect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/posts" element={<Postings />} />
          <Route path="/chat/:userId" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
