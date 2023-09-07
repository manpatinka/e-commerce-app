const express = require('express');
const router = express.Router();
const { isAuthorized } = require('../services/authService');
const {
    createOrder,
    getOrdersByCustomerId,
    getOrderByOrderId
} = require('../services/orderService');

module.exports = (app) => {
    app.use('/orders', isAuthorized, router);

    //get an order by customer id

    router.get('/', async (req, res) => {
        try {
            const customerId = req.customer.id;
            const ordersByCustomerId = await getOrdersByCustomerId(customerId);
            if (!ordersByCustomerId) return res.sendStatus(404);
            res.send(ordersByCustomerId);
        } catch (err) {
            res.send(err.message);
        }
    })

    //get an order by order id

    router.get('/:orderId', async (req, res) => {
        try {
            const { orderId } = req.params;
            const orderById = await getOrderByOrderId(orderId, req.customer.id);
            if(!orderById) return res.sendStatus(404);
            res.send(orderById);
        } catch (err) {
            res.send(err.message);
        }
    })

    //create new order from cart

    router.post('/:customerId/:cartId', isAuthorized, async (req, res) => {
        try {
            const newOrder = await createOrder(req.params.customerId, req.params.cart);
            res.send(newOrder);
    
        } catch (err) {
            res.send(err.message);
        }
    })

}