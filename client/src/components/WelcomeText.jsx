import { Box, Typography } from '@mui/material';

const WelcomeText = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography variant="h2" align="center">
        <Box component="span" sx={{ fontFamily: 'Great Vibes', mr: 3 }}>
          Welcome to
        </Box>
        <Box component="span" sx={{ fontFamily: 'Orbitron', color: 'primary.main', fontWeight: 'bold' }}>
          NoteNeuron
        </Box>
      </Typography>
    </Box>
  );
};

export default WelcomeText;
