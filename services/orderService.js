const db = require('../db');

async function createOrder(customerId, cart) {
    const total = totalCost(cart.items);
    const newOrder = await db.query(`INSERT INTO orders 
    (customer_id, order_date, total_cost) 
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [customerId, new Date(), total]);
    if (!newOrder.rows.length) return null;
    return newOrder.rows[0];
}

async function addToOrderProducts (orderId, products) {
    for (const item of products) {
        const { id, quantity } = item;
        await db.query(`INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)`, [orderId, id, quantity])
    }
}

async function getOrdersByCustomerId(customerId) {
    const ordersByCustomerId = await db.query(`SELECT * from orders WHERE customer_id = $1 ORDER BY id`, [customerId]);
    if(!ordersByCustomerId.rows.length) return null;
    return ordersByCustomerId.rows;
}

async function getOrderByOrderId(orderId, customerId) {
    const order = await db.query(`SELECT * FROM orders WHERE id = $1 AND customer_id = $2`, [orderId, customerId])
    if(!order.rows.length) return null;
    return order.rows[0];
}


const totalCost = cartProducts => {
    const totalSum = cartProducts.map(item => item.price_per_unit * item.quatity).reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2);
    return totalSum;
}

module.exports = {
    createOrder,
    addToOrderProducts,
    getOrdersByCustomerId,
    getOrderByOrderId
}