const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById } = require('../services/productService');
const { isAuthorized } = require('../services/authService');

module.exports = (app) => {
    app.use('/products', router);

    router.get('/', async (req, res) => {
        try {
            const productList = await getAllProducts();
            res.send(productList);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const product = await getProductById(id);
            if (!product) return res.status(404).send('Product not found');
            res.send(product);
        } catch (error) {
            console.log(error)
            return res.status(500).send('Error getting product')
        }
    });
    
    // add product to database
    router.post('/', isAuthorized, async (req, res) => {
        try {
            const { productName, price } = req.body;
            const newProduct = await addProduct(productName, price);
            res.status(201).send(newProduct);
        } catch (err) {
            console.log('Error insering product into database. ', err.stack);
            res.status(500).send('Failed to add product to database');
        }
    });
}