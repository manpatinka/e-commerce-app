const db = require('../db');
const { passwordHash } = require('./authService');

async function getCustomerByUsername(username) {
    const customer = await db.query('SELECT * FROM customers WHERE username = $1', [username]);
    return customer.rows[0];
}

async function getCustomerById(id) {
    const customer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    return customer.rows[0];
}

async function updateCustomer(id, data) {
    //is it password to change?
    const isPassword = Object.keys(data).includes('password');
    if(isPassword) {
        const hashedPassword = await passwordHash(data.password.toString(), 10)
        data.password = hashedPassword;
    }

    const columns = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(data);
    const customer = await db.query(`UPDATE customers SET ${columns} WHERE id = $${columns.length + 1} RETURNING *`, [...values, id]);

    return customer.rows[0];
}

async function deleteCustomer(id) {
    return db.query('DELETE FROM customers WHERE id = $1', [id]);
}

module.exports = { getCustomerByUsername, getCustomerById, updateCustomer, deleteCustomer };