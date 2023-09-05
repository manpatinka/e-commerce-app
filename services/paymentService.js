const db = require('../db');

async function getPaymentData(customerId) {
    try {
        const data = await db.query('SELECT * FROM payment_details WHERE id = (SELECT payment_id FROM customers WHERE id = $1)', [customerId]);
        return data.rows?.length ? data.rows[0] : null;
    } catch (err) {
        throw new Error(err);
    }
};

async function createPaymentDetails(data) {
    try {
        const { card_type, card_number, expiry_date, name_on_card} = data;
        const payData = await db.query('INSERT INTO payment_details (card_type, card_number, expiry_date, name_on_card) VALUES ($1, $2, $3, $4) RETURNING *', [card_type, card_number, expiry_date, name_on_card]);
        return payData.rows?.length ? payData.rows[0] : null;

    } catch (err) {
        throw new Error(err);
    }
};

async function setPaymentId(customerId, paymentId) {
    try {
        const data = await db.query('UPDATE customers SET payment_id = $1 WHERE id = $2 RETURNING *', [paymentId, customerId]);
        return data.rows?.length ? data.rows[0] : null;

    } catch (err) {
        throw new Error(err);
    }
};

async function updatePaymentDetails(customerId, data) {
    try {
        for(const property in data) {
            await db.query(`UPDATE payment_details SET ${property} = $1 WHERE id = (SELECT payment_id FROM customers WHERE id = $2)`, [data[property], customerId]);
        }
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    getPaymentData,
    createPaymentDetails,
    setPaymentId,
    updatePaymentDetails
};