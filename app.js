require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
require('./config/passport');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Model (temporary inline model)
const User = mongoose.model('User', new mongoose.Schema({
  googleId: String,
  displayName: String,
}));

// Passport config
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({ googleId: profile.id, displayName: profile.displayName });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));
app.use(passport.initialize());
app.use(passport.session());
// Make the user available in all Pug templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/entries', require('./routes/entryRoutes'));
app.use('/auth', authRoutes);

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/entries',
  })
);
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
