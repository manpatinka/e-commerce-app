const express = require('express');
const router = express.Router();
const { getCustomerById, updateCustomer, deleteCustomer } = require('../services/customerService');
const { isAuthorized } = require('../services/authService');

module.exports = (app) => {
    app.use('/customer', isAuthorized, router);

    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const customer = await getCustomerById(id);

            if(!customer) return res.status(404).send('Customer not found');

            res.status(200).send(customer);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const customer = await getCustomerById(id);
            if(!customer) return res.status(404).send('Customer not found');

            const response = await updateCustomer(id, data);
            res.send(response);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const customer = await getCustomerById(id);
            if(!customer) return res.status(404).send('Customer not found');

            await deleteCustomer(id);
            res.status(204).send('Customer has been deleted')
        } catch (err) {
            res.status(500).send(err.message)
        }
    });


}