import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Notfound from './pages/Notfound';
import Navbar from './components/Navbar';
import {TaskContextProvider} from './context/TaskContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from "./supabase/client"



function App() {

  const navigate = useNavigate();

  useEffect(() => {

    return () => {
      supabase.auth.onAuthStateChange((event, session) => {
        if(!session){
          navigate('/login')
        } else {
          navigate('/')
        }
      });
    };
  }, [navigate]);

  return (
    <div className="App">
      <TaskContextProvider> 
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </TaskContextProvider>
    </div>
  );
}

export default App;
