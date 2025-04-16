import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Button, useTheme } from '@mui/material';
import CreateCanvasDialog from '../components/CreateCanvasDialog';
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBar from '../components/SearchBar';

const HomePageToolbar = ({ onCanvasCreated }) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [canvases, setCanvases] = useState([]); // assume canvas list state

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
        <Box sx={{ maxWidth: 300, width: '100%' }}>
          <SearchBar />
        </Box>

        {/* ➕ Create New Canvas */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={textButtonStyle}
          onClick={() => setOpenDialog(true)}
        >
          Create New Canvas
        </Button>
        <CreateCanvasDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          onCanvasCreated={(newCanvas) => {
            setCanvases(prev => [newCanvas, ...prev]); // local usage (if needed)
            if (onCanvasCreated) onCanvasCreated(newCanvas); // update Home.jsx state
          }}
        />
        {/* 📂  */}
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
