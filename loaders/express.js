const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');


module.exports = (app) => {
    app.use(express.json());

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" },
            resave: false,
            saveUninitialized: false
        })
    );
}