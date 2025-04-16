const Canvas = require('../models/Canvas');
const User = require('../models/User');

exports.fetchSheets = async(req,res) => {
    try{
        // Get user ID from the authenticated user
    const userId = req.user.id; // Assuming you have authentication middleware that attaches the user

    // Find the user and their visible sheets
    const user = await User.findById(userId).select('visible_sheets');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const visibleSheets = user.visible_sheets;

    // If the user has no visible sheets, return an empty array
    if (visibleSheets.length === 0) {
      return res.json([]);
    }

    // Query the Canvas model to find the recent 5 sheets by date_last_opened
    const recentSheets = await Canvas.find({
      sheet_id: { $in: visibleSheets },
    })
      .sort({ date_last_opened: -1 }) // Sort by last opened date in descending order
      .limit(5); // Get only 5 sheets

    return res.json(recentSheets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
    }
};

exports.createCanvas = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // From auth middleware

    // Fetch user to get username
    const user = await User.findById(userId).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newCanvas = new Canvas({
      title,
      description,
      collaborators: [{ userId, username: user.username, role: 'owner' }],
    });

    // Add sheet_id to user's visible_sheets
    await User.findByIdAndUpdate(userId, {
        $addToSet: { visible_sheets: newCanvas.sheet_id },
    });

    await newCanvas.save();
    res.status(201).json(newCanvas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create canvas' });
  }
};


exports.searchSheets = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q || '';

    const user = await User.findById(userId).select('visible_sheets');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matchingSheets = await Canvas.find({
      sheet_id: { $in: user.visible_sheets },
      title: { $regex: query, $options: 'i' }, // case-insensitive partial match
    }).limit(10); // You can adjust the number of suggestions

    res.json(matchingSheets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during search' });
  }
};