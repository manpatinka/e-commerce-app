const express = require('express');
const router = express.Router();
const { isAuthorized, passwordHash } = require('../services/authService');
const { getCustomerByUsername } = require('../services/customerService');
const db = require('../db');

module.exports = (app, passport) => {
    app.use(router);

    router.post('/register', async (req, res) => {
        const { email, username, password } = req.body;
        try {
            const ifCustomerExists = await getCustomerByUsername(username);
            if(ifCustomerExists) return res.status(409).send(`User "${username}" already exists`);

            const hashedPassword = await passwordHash(password.toString(), 10);
            const dbRes = await db.query(`insert into customers(email, username, password) values ($1, $2, $3) RETURNING username`, [email, username, hashedPassword]);
            res.status(201).send(`Successfully registered ${dbRes.rows[0].username}`)
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal error');
        }
    });

    router.get('/login', (req, res) => {
        if (!req.customer) return res.status(404).send('Log in first');
        res.send(`Welcome ${req.customer.username}`)
    });

    router.post('/login', passport.authenticate('local', { failureMessage: true }), (req, res) => {
        res.send(`Logged in as ${req.body.username}`);
    } );

    router.post('/logout', isAuthorized, (req,res) => {
        req.logout(err => {
            if (err) return res.send(err)
            res.send(`Logged out`)
        });
    });
}