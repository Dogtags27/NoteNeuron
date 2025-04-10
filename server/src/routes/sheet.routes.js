import express from 'express';
import {
  createSheet,
  getUserSheets,
  updateSheetData,
} from '../controllers/sheet.controller.js';

const router = express.Router();

router.post('/', createSheet); // Create new sheet
router.get('/:ownerId', getUserSheets); // Get all sheets by user
router.put('/:sheetId', updateSheetData); // Update content

export default router;
