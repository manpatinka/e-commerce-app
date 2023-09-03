const passport = require('passport');
const localStrategy = require('passport-local');
const { getCustomerByUsername } = require('../services/customerService');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.use(passport.initialize(), passport.session());

    passport.use(
        new localStrategy(async function (username, password, done) {
            const incorrectData = { message: 'Incorrect username or password' }
            try {
                const customer = await getCustomerByUsername(username);
                if(!customer) return done(null, false, incorrectData);

                const matchedPassword = await bcrypt.compare(password, customer.password);
                if(!matchedPassword) return done(null, false, incorrectData);

                return done(null, customer);
            } catch (err) {
                return done(err);
            }
         })
    )
};

passport.serializeUser((customer, done) => {
    done(null, {
        id: customer.id,
        username: customer.username
    });
});

passport.deserializeUser((customer, done) => {
    done(null, customer)
});