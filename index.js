require('dotenv').config();
const express = require('express');
const app = express();

const expressLoader = require('./loaders/express');
const passportLoader = require('./loaders/passport');
const swaggerLoader = require('./loaders/swagger');

const passport = require('passport');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

const PORT = process.env.PORT || 3000;

expressLoader(app);

passportLoader(app);

authRouter(app, passport);
productsRouter(app);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});