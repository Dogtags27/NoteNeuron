import { Box, Typography, IconButton, Avatar, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
      } catch (err) {
        toast.error('Not authorized');
        navigate('/login');
      }
    };
    fetchProfile();
  }, []);
  
  const handleLogout = async () => {
    setOpenDialog(false);
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    clearUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/home')}><ArrowBackIcon /></IconButton>
        <IconButton onClick={() => setOpenDialog(true)}><LogoutIcon /></IconButton>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Avatar sx={{ width: 120, height: 120, mb: 2 }} />
        <Typography variant="h5" gutterBottom>{user?.username}</Typography>
        <Typography variant="body1">{user?.email}</Typography>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
