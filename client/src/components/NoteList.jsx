import { Box, Stack } from '@mui/material';
import NoteCard from './NoteCard';


const dummyNotes = [
    {
      title: 'Project Planning',
      type: 'Public',
      date: '2025-04-10',
      collaborators: [
        { username: 'alice', role: 'owner' },
        { username: 'bob', role: 'editor' },
        { username: 'charlie', role: 'viewer' },
        { username: 'diana', role: 'viewer' }
      ]
    },
    {
      title: 'Model Design',
      type: 'Private',
      date: '2025-04-11',
      collaborators: [
        { username: 'eve', role: 'owner' },
        { username: 'frank', role: 'editor' }
      ]
    },
    {
        title: 'Project Planning',
        type: 'Public',
        date: '2025-04-10',
        collaborators: [
          { username: 'alice', role: 'owner' },
          { username: 'bob', role: 'editor' },
          { username: 'charlie', role: 'viewer' },
          { username: 'diana', role: 'viewer' }
        ]
      },
      {
        title: 'Model Design',
        type: 'Private',
        date: '2025-04-11',
        collaborators: [
          { username: 'eve', role: 'owner' },
          { username: 'frank', role: 'editor' }
        ]
      }
  ];

const NoteList = () => {
  return (
    <Box sx={{ maxHeight: '50vh', overflowY: 'auto', px: 2 }}>
      <Stack spacing={2}>
        {dummyNotes.map((note, index) => (
          <NoteCard key={index} {...note} index={index}/>
        ))}
      </Stack>
    </Box>
  );
};

export default NoteList;
