import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const Canvas = () => {
  const [elements, setElements] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addTextBox = () => {
    const newElement = {
      id: nextId,
      type: 'text',
      content: '',
      x: 100,
      y: 100,
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  const handleDrag = (e, id) => {
    const updated = elements.map(el => {
      if (el.id === id) {
        return { ...el, x: e.clientX, y: e.clientY };
      }
      return el;
    });
    setElements(updated);
  };

  const handleChange = (e, id) => {
    const updated = elements.map(el => {
      if (el.id === id) {
        return { ...el, content: e.target.value };
      }
      return el;
    });
    setElements(updated);
  };

  return (
    <Box
      sx={{
        height: '80vh',
        border: '2px dashed #ccc',
        borderRadius: 2,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Button variant="contained" onClick={addTextBox} sx={{ mb: 2 }}>
        ➕ Add Text Box
      </Button>

      {elements.map((el) => (
        <Box
          key={el.id}
          draggable
          onDragEnd={(e) => handleDrag(e, el.id)}
          sx={{
            position: 'absolute',
            top: el.y,
            left: el.x,
            width: 200,
          }}
        >
          <TextField
            value={el.content}
            onChange={(e) => handleChange(e, el.id)}
            fullWidth
            multiline
            size="small"
          />
        </Box>
      ))}
    </Box>
  );
};

export default Canvas;
