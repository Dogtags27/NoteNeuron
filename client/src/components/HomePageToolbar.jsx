import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Button,
  useTheme
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FilterListIcon from '@mui/icons-material/FilterList';

const HomePageToolbar = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchText);
    fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: searchText }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => {
      console.log('Dummy search result:', data);
    });
  };

  return (
    <Box
      sx={{
        mt: 3,
        mb: 2,
        px: 2,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        background: theme.palette.mode === 'light'
          ? '#f5f5f5'
          : '#1a1a1a',
        borderRadius: 4,
        boxShadow: `0 4px 12px ${theme.palette.primary.main}22`,
      }}
    >
      {/* Left section: Search + Create + Open */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {/* 🔍 Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: `0 0 8px ${theme.palette.primary.main}`,
            maxWidth: 300,
            width: '100%',
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search canvases..."
            InputProps={{
              disableUnderline: true,
              sx: {
                px: 2,
                py: 1,
                fontSize: '1rem',
                color: theme.palette.text.primary,
                fontFamily: 'Arial, sans-serif'
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton onClick={handleSearch} sx={{ color: theme.palette.primary.main }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* ➕ Create New Canvas */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={textButtonStyle}
        >
          Create New Canvas
        </Button>

        {/* 📂 Open Existing Canvas */}
        <Button
          variant="outlined"
          startIcon={<FolderOpenIcon />}
          sx={textButtonStyle}
        >
          Open Existing Canvas
        </Button>
      </Box>

      {/* Right section: Filter/Sort */}
      <Tooltip title="Filter and Sort" arrow>
        <IconButton sx={iconButtonStyle}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// 🌟 Styled buttons
const textButtonStyle = {
  fontWeight: 'bold',
  borderRadius: 3,
  textTransform: 'none',
  fontFamily: 'inherit',
  '&:hover': {
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)',
    transform: 'scale(1.03)',
  }
};

const iconButtonStyle = {
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'inherit',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)'
  }
};

export default HomePageToolbar;
