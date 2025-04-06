const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/entries'); // after login
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
