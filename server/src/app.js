import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import sheetRoutes from './routes/sheet.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('NoteNeuron Backend is Running!');
});



app.use('/api/users', userRoutes);


app.use('/api/sheets', sheetRoutes);


export default app;
