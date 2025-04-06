const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

router.use(express.urlencoded({ extended: true }));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

// List all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 }).populate('user');
    res.render('entries', { entries, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Show form to create new entry
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('new-entry');
});

// Handle form submission
router.post('/new', ensureAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { title, location, description } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const entry = new Entry({
      title,
      location,
      description,
      photoUrl,
      user: req.user._id
    });

    await entry.save();
    res.redirect('/entries');
  } catch (err) {
    console.error('Error saving entry:', err);
    res.status(500).send('Something went wrong.');
  }
});


 // Show edit form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send('Entry not found');
    res.render('edit-entry', { entry });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

 // Update entry
 router.post('/:id/edit', ensureAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) return res.status(404).send('Entry not found');
    if (!entry.user.equals(req.user._id)) return res.status(403).send('Unauthorized');

    entry.title = req.body.title;
    entry.location = req.body.location;
    entry.description = req.body.description;

    if (req.file) {
      // Remove old image if exists
      if (entry.photoUrl) {
        const oldPath = path.join(__dirname, '../uploads/', path.basename(entry.photoUrl));
        fs.unlink(oldPath, err => {
          if (err) console.error('Old image not deleted:', err);
        });
      }
      entry.photoUrl = `/uploads/${req.file.filename}`;
    }

    await entry.save();
    res.redirect('/entries');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});


 // Delete entry
 router.get('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send('Entry not found');
    if (!entry.user.equals(req.user._id)) return res.status(403).send('Unauthorized');

    // Delete the image file
    if (entry.photoUrl) {
      const filePath = path.join(__dirname, '../uploads/', path.basename(entry.photoUrl));
      fs.unlink(filePath, err => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    await Entry.findByIdAndDelete(req.params.id);
    res.redirect('/entries');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed');
  }
});



  

module.exports = router;
