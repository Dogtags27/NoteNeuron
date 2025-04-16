import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box} from '@mui/material';
import WelcomeText from '../components/WelcomeText';
import NoteList from '../components/NoteList';
import HomePageToolbar from '../components/HomePageToolbar';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);
  const [recentSheets, setRecentSheets] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`, {
          credentials: 'include',
        });

        if (!res.ok) {
          clearUser();
          throw new Error('Unauthorized');
        }
      } catch (err) {
        clearUser();
        toast.error('User is not authenticated');
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchRecentSheets = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/canvas/visible-sheets`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch sheets');
        }

        const sheets = await res.json();
        setRecentSheets(sheets);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load recent sheets');
      }
    };

    fetchRecentSheets();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <WelcomeText />
      <HomePageToolbar onCanvasCreated={(newCanvas) => setRecentSheets(prev => [newCanvas, ...prev])} />
      <NoteList sheets={recentSheets}/>
    </Box>
  );
};

export default Home;