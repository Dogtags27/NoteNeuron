import React, { useState } from 'react'
import { TextField, Button, Typography, Box, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Paper, useTheme } from '@mui/material';

const Signup = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required');
      toast.error("Some fields are empty");
      return
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        // Store user info locally
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to home if successful
        window.location.href = '/home';
      } else {
        // Show error toast if signup fails. 
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  return (
  <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', p: 2 }}>
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 4,
        width: '100%',
        maxWidth: 400,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
      }}
    >
    <form onSubmit={handleSignup}>
      <Typography variant="h5" mb={2}>Sign Up</Typography>
      <TextField fullWidth label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
      <Typography mt={2}>
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
      </form>
    </Paper>
  </Box>
);
}

export default Signup
