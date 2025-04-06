const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

router.use(express.urlencoded({ extended: true }));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }  

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
  router.post('/new', async (req, res) => {
    try {
      const { title, location, description, photoUrl } = req.body;
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
  router.post('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
      const { title, location, description, photoUrl } = req.body;
      await Entry.findByIdAndUpdate(req.params.id, {
        title,
        location,
        description,
        photoUrl
      });
      res.redirect('/entries');
    } catch (err) {
      console.error(err);
      res.status(500).send('Update failed');
    }
  });

  // Delete entry
  router.get('/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
      await Entry.findByIdAndDelete(req.params.id);
      res.redirect('/entries');
    } catch (err) {
      console.error(err);
      res.status(500).send('Delete failed');
    }
  });
  
  
  

module.exports = router;
