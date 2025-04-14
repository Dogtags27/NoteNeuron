import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Stack, useTheme } from '@mui/material';
import WelcomeText from '../components/WelcomeText';
import NoteList from '../components/NoteList';
import HomePageToolbar from '../components/HomePageToolbar';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }
      } catch (err) {
        toast.error('User is not authenticated');
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <WelcomeText />
      <HomePageToolbar />
      <NoteList />
    </Box>
  );
};

export default Home;