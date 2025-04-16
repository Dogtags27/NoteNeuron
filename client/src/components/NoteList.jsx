import { Box, Stack } from '@mui/material';
import NoteCard from './NoteCard';

const NoteList = ({ sheets }) => {
  if (!sheets || sheets.length === 0) {
    return <p className="text-center text-gray-500">No recent sheets to show.</p>;
  }
  return (
    <Box sx={{ maxHeight: '50vh', overflowY: 'auto', px: 2 }}>
      <Stack spacing={2}>
        {sheets.map((note, index) => (
          <NoteCard key={index} {...note} index={index}/>
        ))}
      </Stack>
    </Box>
  );
};

export default NoteList;
