const express = require('express');
const router = express.Router();
const isAuthorized = require('../services/authService');
const { 
    getPaymentData,
    createPaymentDetails,
    setPaymentId,
    updatePaymentDetails 
} = require('../services/paymentService');

module.exports = (app) => {
    app.use('/payment', router);

    router.get('/:customerId', isAuthorized, async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const response = await getPaymentData(customerId);
            res.json(response);
        } catch (err) {
            next(err);
        }
    })

    router.post('/:customerId', isAuthorized, async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const data = req.body;
            const response = await createPaymentDetails(customerId, data);
            res.json(response);
        } catch (err) {
            next(err);
        }
    });

    router.put('/:customerId', isAuthorized, async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const data = req.body;
            const response = await updatePaymentDetails(customerId, data);
            res.json(response);
        } catch (err) {
            next(err);
        }
    })
}