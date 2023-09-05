const db = require('../db');

async function createCart(customerId) {
    const dateCreated = new Date;

    const newCart = await db.query(`INSERT INTO carts (customer_id, created_date) VALUES ($1, $2) RETURNING *`, [customerId, dateCreated]);
    if (!newCart.rows.length) throw Error("Couldn't create cart");
    return newCart.rows[0];
}

async function getCartByCustomerId(customerId) {
    const cart = await db.query(`SELECT * FROM carts WHERE customer_id = $1`, [customerId]);
    if (!cart.rows.length) return null;
    return cart.rows[0];
}

async function addToCart(cartId, productId, quantity = 1) {
    const addedProduct = await db.query(`INSERT INTO carts_products (cart_id, product_id, quantity) 
    VALUES ($1, $2, $3) 
    RETURNING *`, [cartId, productId, quantity]);
    if (!addedProduct.rows.length) throw new Error('Failed to add new item');
    return addedProduct.rows[0];
}

async function updateQuantity(cartId, productId, quantity) {
    const updatedItem = await db.query(`UPDATE carts_products
    SET quantity = $1
    WHERE product_id = $2 AND cart_id = $3
    RETURNING *`, [quantity, productId, cartId]);

    if (!updatedItem.rows.length) throw new Error('Failed to update');
    return updatedItem.rows[0];
}

async function getCartProducts(cartId) {
    const cartProducts = await db.query(`SELECT products.*, carts_products.quantity
    FROM products
    INNER JOIN carts_products ON products.id = carts_products.product_id
    WHERE carts_products.cart_id = $1`, [cartId]);

    if (!cartProducts.rows.length) return null;
    return cartProducts.rows;
}

async function deleteItemFromCart(cartId, productId) {
    const deletedItem = await db.query(`DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *`, [cartId, productId]);
    if (!deletedItem.rows.length) throw Error('Failed to remove item');
    return deletedItem.rows[0];
}

async function deleteCart(cartId) {
    db.query(`DELETE FROM carts WHERE id = $1`, [cartId]);
    db.query(`DELETE FROM carts_products WHERE cart_id = $1`, [cartId]);
    return null;
}

module.exports = {
    createCart,
    getCartByCustomerId,
    addToCart,
    updateQuantity,
    getCartProducts,
    deleteItemFromCart,
    deleteCart
}