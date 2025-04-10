// import React from 'react';
// import Canvas from './components/Canvas';
// import { Container, Typography } from '@mui/material';
// import { useEffect } from 'react';
// import { useSocket } from './context/SocketContext';

// function App() {
//   const socket = useSocket();

//   useEffect(() => {
//     console.log('🧠 Socket available in App:', socket);
//   }, [socket]);

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         🧠 NoteNeuron: Hackathon Whiteboard
//       </Typography>
//       <Canvas />
//     </Container>
//   );
// }

// export default App;

// client/src/App.jsx
import React from 'react';
import SheetEditor from './components/SheetEditor';

function App() {
  return (
    <div>
      <h1>NoteNeuron</h1>
      <SheetEditor sheetId="test-sheet-id" />
    </div>
  );
}

export default App;
