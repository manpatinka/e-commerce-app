const express = require('express');
const router = express.Router();

const {
    createCart,
    getCartByCustomerId,
    addToCart,
    updateQuantity,
    getCartProducts,
    deleteItemFromCart,
    deleteCart
} = require('../services/cartService');
const { getProductById } = require('../services/productService');
const { isAuthorized } = require('../services/authService');

module.exports = (app) => {
    app.use('/cart', isAuthorized, router);

    //create a new cart
    router.post('/', async (req, res) => {
        try {
            const customerId = req.customer.id;
            const hasCart = await getCartByCustomerId(customerId);
            if (hasCart) return res.status(409).send('Cart already exists')

            const cart = await createCart(customerId);
            res.status(201).send(cart);

        } catch (err) {
            res.send(err.message)
        }
    })

    //get all from cart
    router.get('/', isEmptyCart, async (req, res) => {
        try {
            const { cartItems } = req;
            res.send(cartItems);
        } catch (err) {
            res.status(500).send(err.message);
        }
    })

    //add a product to cart
    router.post('/:productId', async (req, res) => {
        try {
            const { productId } = req.params;
            const cartItems = await getCartProducts(req.cart.id);

            // product already in the cart => update quantity
            const checkExistingProduct = cartItems.find(item => item.id = productId);
            if (checkExistingProduct) {
                return res.send(await updateQuantity(req.cart.id, productId, checkExistingProduct.quantity + 1))
            }

            const addedProduct = await addToCart(req.cart.id, productId);
            res.status(201).send(addedProduct);
        } catch (err) {
            res.status(500).send(err.message)
        }
    })

    //update quantity of a product
    router.put('/:productId', async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const updatedProduct = await updateQuantity(req.cart.id, productId, quantity);
            res.send(updatedProduct);
        } catch (err) {
            res.status(500).send(err.message)
        }
    })

    //remove item from cart
    router.delete('/:productId', async (req, res) => {
        try {
            const { productId } = req.params;
            const removedProduct = await deleteItemFromCart(req.cart.id, productId);
            res.sendStatus(204);
        } catch (err) {
            res.send(err.message)
        }
    })
}

async function isEmptyCart(req, res, next) {
    const { id } = req.customer;
    const cart = await getCartByCustomerId(id);
    const cartItems = await getCartProducts(cart.id);
    if (!cart) return res.send('Cart not found');
    if (!cartItems) return res.send('Cart is empty');
    req.cart = cart;
    req.cartItems = cartItems;
    next();
}