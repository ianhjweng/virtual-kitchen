// app.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const recipeRoutes = require('./routes/recipes');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 7004;

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data (e.g., from forms)
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(session({
    secret: 'yourSecretKeyHere',
    resave: false,
    saveUninitialized: false
}));

// Mount recipe-related routes
app.use('/recipes', recipeRoutes);

// Routes
app.get('/', (req, res) => {
    res.render('home', { session: req.session });
});

app.get('/contact', (req, res) => {
    res.render('contact', { session: req.session });
});

app.get('/register', (req, res) => {
    res.render('register', { session: req.session });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send('Please fill in all fields.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err) => {
            if (err) {
                console.error(err);
                return res.send('Something went wrong. Maybe this email or username is taken.');
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Hashing error:', error);
        res.send('Server error.');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { error: null, session: req.session });
});

app.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(sql, [identifier, identifier], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.render('login', { error: 'User not found.', session: req.session });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render('login', { error: 'Incorrect password.', session: req.session });
        }

        req.session.user = {
            uid: user.uid,
            username: user.username
        };

        res.redirect('/');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
