const Entry = require('../models/Entry');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// all entries
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 }).populate('user');
    res.render('entries', { entries, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// creating new entry
exports.createEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('new-entry', { errors: errors.array() });
  }

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
};

// edit form
exports.showEditForm = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send('Entry not found');
    res.render('edit-entry', { entry });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

// Update entry
exports.editEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const entry = await Entry.findById(req.params.id);
    return res.status(400).render('edit-entry', { entry, errors: errors.array() });
  }

  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send('Entry not found');
    if (!entry.user.equals(req.user._id)) return res.status(403).send('Unauthorized');

    entry.title = req.body.title;
    entry.location = req.body.location;
    entry.description = req.body.description;

    if (req.file) {
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
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).send('Entry not found');
    if (!entry.user.equals(req.user._id)) return res.status(403).send('Unauthorized');

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
};
