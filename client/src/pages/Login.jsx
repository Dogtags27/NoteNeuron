import React, { useState } from 'react'
import { TextField, Button, Typography, Box, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Paper, useTheme } from '@mui/material';

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to home if successful
        window.location.href = '/home';
      } else {
        // Show error toast if login fails
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error connecting to server:');
      console.log(error)
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
      <Typography variant="h5" mb={2}>Login</Typography>
      <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
      <Typography mt={2}>
        Don’t have an account? <Link href="/signup">Sign Up</Link>
      </Typography>
    </Paper>
  </Box>
);
}

export default Login