const express = require('express');
const router = express.Router();

const { activeHome, activeShop, activeBlog, activeAbout, activeContact } = require('../helpers/navbarUrlHelpers');

router.get('/about', (req, res) => {
  const user = req.user;
  res.status(200).render('about', { 
    title: 'About', 
    user,     
    activeHome: activeHome(req.originalUrl),
    activeShop: activeShop(req.originalUrl),
    activeBlog: activeBlog(req.originalUrl),
    activeAbout: activeAbout(req.originalUrl),
    activeContact: activeContact(req.originalUrl) });
});

module.exports = router;