import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) return setSuggestions([]);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/canvas/search?q=${encodeURIComponent(query)}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setSuggestions(data);
        setHighlightedIndex(-1); // reset on new query
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelect(suggestions[highlightedIndex]);
    } else {
      console.log('Manual search for:', query);
    }
  };

  const handleSelect = (sheet) => {
    console.log(`Clicked: ${sheet.title}`);
    // TODO: trigger open or navigation logic
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex]);
      } else {
        handleSearch();
      }
    }
  };

  const highlightMatch = (title) => {
    const index = title.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return title;
  
    const highlightColor =
      theme.palette.mode === 'dark'
        ? 'rgba(138, 43, 226, 0.4)'  // light bluish-purple with opacity
        : 'rgba(138, 43, 226, 0.2)'; // lighter in light theme
  
    return (
      <>
        {title.slice(0, index)}
        <span
          style={{
            backgroundColor: highlightColor,
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '0 2px'
          }}
        >
          {title.slice(index, index + query.length)}
        </span>
        {title.slice(index + query.length)}
      </>
    );
  };
  

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: `0 0 8px ${theme.palette.primary.main}`,
        maxWidth: 300,
        width: '100%',
        zIndex: 10,
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton onClick={handleSearch} sx={{ color: theme.palette.primary.main }}>
        <SearchIcon />
      </IconButton>

      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            mt: 1,
            width: '100%',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 20,
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: `0px 4px 20px ${theme.palette.mode === 'light' ? '#ccc' : '#000'}88`,
          }}
          ref={listRef}
        >
          <List>
            {suggestions.map((sheet, index) => (
              <ListItem
                key={sheet.sheet_id}
                button
                selected={index === highlightedIndex}
                onClick={() => handleSelect(sheet)}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer'
                  },
                  bgcolor: index === highlightedIndex ? `${theme.palette.action.hover}` : 'inherit',
                }}
              >
                <Typography variant="body1" noWrap>
                  {highlightMatch(sheet.title)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
