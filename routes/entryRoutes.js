const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../config/multerConfig');
const { ensureAuthenticated } = require('../middlewares/auth');
const { getAllEntries, createEntry, showEditForm, editEntry, deleteEntry } = require('../controllers/entryController');


// all entries
router.get('/', getAllEntries);

// create new entry
router.get('/new', (req, res) => res.render('new-entry'));

// form submission
router.post('/new', upload.single('photo'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
], createEntry);

// edit form
router.get('/:id/edit', showEditForm);

// Update entry
router.post('/:id/edit', upload.single('photo'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
], editEntry);

// Delete entry
router.get('/:id/delete', deleteEntry);

module.exports = router;
