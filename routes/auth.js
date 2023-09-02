const express = require('express');
const router = express.Router();
const { isAuthorized, passwordHash } = require('../services/authService');
const { getCustomerByUserame } = require('../services/customerService');
const db = require('../db');

module.exports = (app, passport) => {
    app.use(router);

    router.post('/register', async (req, res) => {
        const { email, username, password } = req.body;
        try {
            const ifCustomerExists = await getCustomerByUserame(username);
            if(ifCustomerExists) return res.status(409).send(`User "${username}" already exists`);

            const hashedPassword = await passwordHash(password.toString(), 10);
            const dbRes = await db.query(`insert into customers(email, username, password) values ($1, $2, $3) RETURNING username`, [email, username, hashedPassword]);
            res.status(201).send(`Successfully registered ${dbRes.rows[0].user_name}`)
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal error');
        }
    });
}