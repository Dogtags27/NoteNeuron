import React, { useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Box } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
import { useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import { UserProvider } from './context/UserContext';
const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#3f51b5',
          },
        },
      }),
    [darkMode]
  )

  return (
    <UserProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <ToastContainer />
      <Box sx={{ padding: 2 }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </ThemeProvider>
    </UserProvider>
  )
}

export default App