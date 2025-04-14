import {
    Paper,
    Typography,
    Box,
    Tooltip,
    IconButton,
    Button,
    Collapse,
    Grid,
    useTheme
  } from '@mui/material';
  import StarIcon from '@mui/icons-material/Star';
  import EditIcon from '@mui/icons-material/Edit';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import PublicIcon from '@mui/icons-material/Public';
  import LockIcon from '@mui/icons-material/Lock';
  import GroupIcon from '@mui/icons-material/Group';
  import { motion } from 'framer-motion';
  import { useState } from 'react';
  
  const NoteCard = ({ title, type, date, collaborators = [],index}) => {
    const theme = useTheme();
    const isPublic = type === 'Public';
    const [showCollaborators, setShowCollaborators] = useState(false);
  
    const getRoleColor = (role) => {
      switch (role) {
        case 'owner':
          return '#FFA500'; // Bright orange
        case 'editor':
          return '#00FFFF'; // Neon blue
        case 'viewer':
          return '#90EE90'; // Light green
        default:
          return theme.palette.text.primary;
      }
    };
  
    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
      <Paper
        elevation={4}
        sx={{
            p: 2,
            borderLeft: `6px solid ${theme.palette.primary.main}`,
            borderRadius: 4,
            background: theme.palette.mode === 'light'
            ? 'linear-gradient(to left,rgb(210, 210, 221),rgb(255, 255, 255))'
            : 'linear-gradient(to right, #2a2a2a, #1e1e1e)',
            position: 'relative',
            minHeight: 140,
            transition: 'all 0.3s ease',
            '&:hover': {
            transform: 'scale(1.0075)',
            boxShadow: `0 0 18px ${theme.palette.primary.main}`,
            },
        }}
        >
        {/* Top-right icon with tooltip */}
        <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.2)'}}}>
          <Tooltip title={isPublic ? 'Public Access' : 'Private Access'} arrow>
            <IconButton size="small" >
              {isPublic ? <PublicIcon color="action" /> : <LockIcon color="action" />}
            </IconButton>
          </Tooltip>
        </Box>
  
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Created on: {date}
        </Typography>
  
        <Box mt={2}>
          <Button sx={{transition: 'transform 0.2s ease','&:hover': { transform: 'scale(1.1)' }}}
            variant="outlined"
            size="small"
            startIcon={<GroupIcon />}
            onClick={() => setShowCollaborators((prev) => !prev)}
          >
            {showCollaborators ? 'Hide Collaborators' : 'Show Collaborators'}
          </Button>
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
          <Collapse in={showCollaborators} timeout="auto" unmountOnExit>
            <Box mt={2}>
              <Grid container spacing={2}>
                {collaborators.map(({ username, role }, index) => (
                  <Grid item xs={6} key={index}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    {role === 'owner' && <StarIcon sx={{ fontSize: 20, mr: 1}} />}
                    {role === 'editor' && <EditIcon sx={{ fontSize: 20, mr: 1}} />}
                    {role === 'viewer' && <VisibilityIcon sx={{ fontSize: 20, mr: 1}} />}
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: getRoleColor(role) }}
                      >
                        {username}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ pl: 4, color: theme.palette.text.secondary }}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
          </motion.div>
        </Box>
      </Paper>
      </motion.div>
    );
  };
  
  export default NoteCard;
  