import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const FrostyDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(30, 30, 30, 0.6)'
        : 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)', // for Safari support
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '20px',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      transition: 'all 0.3s ease-in-out',
    },
  }));

const ArtisticForm = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: '1fr',
  padding: '1rem',
  placeItems: 'center',
}));

const CreateCanvasDialog = ({ open, handleClose, onCanvasCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    handleClose();
  };
  const handleCreate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/canvas/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Sends the JWT cookie
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create canvas');
      }

      const data = await response.json();
      onCanvasCreated(data); // Notify parent with the new canvas
      toast.success('Canvas created sucessfully');
      handleCancel();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create canvas')
      alert('Failed to create canvas');
    }
  };

  return (
    <FrostyDialog open={open} onClose={handleClose}>
      <DialogTitle align="center">
        <Typography variant="h5" fontWeight="bold">
          ✨ Create a New Canvas
        </Typography>
      </DialogTitle>
      <DialogContent>
      <ArtisticForm>
  <TextField
    label="Canvas Title"
    variant="filled"
    fullWidth
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
  <TextField
    label="Description"
    variant="filled"
    multiline
    rows={3}
    fullWidth
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
  
  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
    <Button
      onClick={handleCancel}
      variant="outlined"
      color="secondary"
      sx={{ borderRadius: '20px', px: 4 }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleCreate}
      variant="contained"
      color="primary"
      sx={{ borderRadius: '20px', px: 4 }}
    >
      Create
    </Button>
  </Box>
</ArtisticForm>
      </DialogContent>
    </FrostyDialog>
  );
};

export default CreateCanvasDialog;
