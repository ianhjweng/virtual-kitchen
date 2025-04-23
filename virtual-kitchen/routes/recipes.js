const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});
const upload = multer({ storage });

// Display all recipes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM recipes';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('recipes', { recipes: results, session: req.session });
  });
});

// Search recipes
router.get('/search', (req, res) => {
  const { name, type } = req.query;
  let sql = 'SELECT * FROM recipes WHERE 1=1';
  const values = [];

  if (name) {
    sql += ' AND name LIKE ?';
    values.push(`%${name}%`);
  }
  if (type) {
    sql += ' AND type = ?';
    values.push(type);
  }

  db.query(sql, values, (err, results) => {
    if (err) throw err;
    res.render('recipes', { recipes: results, session: req.session });
  });
});

// Show form to add a recipe
router.get('/add', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('add-recipe', { error: null, session: req.session });
});

// Handle recipe submission
router.post('/add', upload.single('image'), (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const { name, description, type, Cookingtime, ingredients, instructions } = req.body;
  const image = req.file ? req.file.filename : null;
  const uid = req.session.user.uid;

  if (!name || !description || !type || !Cookingtime || !ingredients || !instructions || !image) {
    return res.render('add-recipe', {
      error: 'Please fill in all fields.',
      session: req.session
    });
  }

  const sql = `
    INSERT INTO recipes (name, description, type, Cookingtime, ingredients, instructions, image, uid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, description, type, Cookingtime, ingredients, instructions, image, uid], (err) => {
    if (err) {
      console.error(err);
      return res.render('add-recipe', {
        error: 'Something went wrong. Please try again.',
        session: req.session
      });
    }
    res.redirect('/recipes');
  });
});

// Show edit form
router.get('/edit/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sql = 'SELECT * FROM recipes WHERE rid = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    const recipe = results[0];

    if (!recipe || recipe.uid !== req.session.user.uid) {
      return res.redirect('/recipes');
    }

    res.render('edit-recipe', { recipe, session: req.session, error: null });
  });
});

// Handle edit form
router.post('/edit/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const { name, description, type, Cookingtime, ingredients, instructions, image } = req.body;
  const rid = req.params.id;
  const uid = req.session.user.uid;

  const sql = `
    UPDATE recipes
    SET name=?, description=?, type=?, Cookingtime=?, ingredients=?, instructions=?, image=?
    WHERE rid=? AND uid=?
  `;

  db.query(sql, [name, description, type, Cookingtime, ingredients, instructions, image, rid, uid], (err) => {
    if (err) {
      console.error(err);
      return res.render('edit-recipe', {
        error: 'Something went wrong.',
        recipe: { ...req.body, rid },
        session: req.session
      });
    }
    res.redirect('/recipes');
  });
});

// Delete a recipe
router.post('/delete/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const rid = req.params.id;
  const uid = req.session.user.uid;

  const getImageSql = 'SELECT image FROM recipes WHERE rid = ? AND uid = ?';
  db.query(getImageSql, [rid, uid], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error getting image before delete:', err);
      return res.redirect('/recipes');
    }

    const imageFile = results[0].image;
    const imagePath = path.join(__dirname, '../public/images', imageFile);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.warn('Image file not deleted (might not exist):', unlinkErr.message);
      }

      const deleteSql = 'DELETE FROM recipes WHERE rid = ? AND uid = ?';
      db.query(deleteSql, [rid, uid], (deleteErr) => {
        if (deleteErr) {
          console.error('Failed to delete recipe:', deleteErr);
        }
        res.redirect('/recipes');
      });
    });
  });
});

// View a single recipe
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM recipes WHERE rid = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).send('Recipe not found');
    }

    const recipe = results[0];
    res.render('recipe-detail', { recipe, session: req.session });
  });
});

module.exports = router;
