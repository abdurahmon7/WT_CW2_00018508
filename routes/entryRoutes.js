const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../config/multerConfig');
const { ensureAuthenticated } = require('../middlewares/auth');
const { getAllEntries, createEntry, showEditForm, editEntry, deleteEntry } = require('../controllers/entryController');


// List all entries
router.get('/', getAllEntries);

// Show form to create new entry
router.get('/new', ensureAuthenticated, (req, res) => res.render('new-entry'));

// Handle form submission
router.post('/new', ensureAuthenticated, upload.single('photo'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
], createEntry);

// Show edit form
router.get('/:id/edit', ensureAuthenticated, showEditForm);

// Update entry
router.post('/:id/edit', ensureAuthenticated, upload.single('photo'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
], editEntry);

// Delete entry
router.get('/:id/delete', ensureAuthenticated, deleteEntry);

module.exports = router;
