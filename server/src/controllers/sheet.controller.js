import Sheet from '../models/Sheet.js';

export const createSheet = async (req, res) => {
  try {
    const { title, ownerId } = req.body;
    const sheet = new Sheet({
      title,
      owner: ownerId,
    });
    await sheet.save();
    res.status(201).json(sheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserSheets = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const sheets = await Sheet.find({ owner: ownerId }).sort({ updatedAt: -1 });
    res.status(200).json(sheets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSheetData = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { data } = req.body;
    const sheet = await Sheet.findByIdAndUpdate(
      sheetId,
      { data, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(sheet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
