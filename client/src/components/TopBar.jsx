// src/components/TopBar.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Switch, Box, IconButton } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext

const TopBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || user.username || 'User',
        email: user.email || '',
      });
      console.log(user.name, user.email);
    }
  }, [user]);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          NoteNeuron
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Brightness7Icon
            sx={{
              color: !darkMode ? '#FFC107' : 'inherit',
              transition: 'color 0.3s ease',
            }}
          />
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <Brightness4Icon
            sx={{
              color: darkMode ? '#FFC107' : 'inherit',
              transition: 'color 0.3s ease',
            }}
          />
        </Box>

        {userInfo && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton onClick={() => navigate('/profile')} color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1">{userInfo.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {userInfo.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
