require('dotenv').config();
const express = require('express');
const app = express();

const expressLoader = require('./loaders/express');
const passportLoader = require('./loaders/passport');
const swaggerLoader = require('./loaders/swagger');

const passport = require('passport');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const customerRouter = require('./routes/customer');
const paymentRouter = require('./routes/payment');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce REST API",
      version: "1.0.0",
      description: "A simple e-commerce API"
    },
    schema: [
      "http",
      "https"
    ],
    servers: [
      {
        url: "https://jims-ecommerce-rest-api.herokuapp.com/",
      }
    ],
  },
  apis: ["./swagger.yml"]
}
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

expressLoader(app);

passportLoader(app);

authRouter(app, passport);

productsRouter(app);

customerRouter(app);

paymentRouter(app);

cartRouter(app);

ordersRouter(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});