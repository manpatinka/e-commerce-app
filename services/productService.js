const db = require('../db');

module.exports = {
    async addProduct(productName, price) {
        try {
            const res = await db.query('INSERT INTO products(product_name, price_per_unit) VALUES ($1, $2) RETURNING *', [productName, price]);
            const newProduct = res.rows[0];
            if (!newProduct) throw new Error('Cannot see a new froduct.')
            return newProduct;
        } catch (err) {
            console.log(err);
        }

    },
    async getAllProducts() {
        try {
            const res = await db.query('SELECT * FROM products');
            const products = res.rows;
            return products;
        } catch (err) {
            console.log(err);
        }
   },

    async getProductById(id) {
        try {
            const res = await db.query('SELECT * FROM products WHERE id = $1', [id]);
            if(!res.rows.length) return null;
            const product = res.rows[0];
            return product;
        } catch (err) {
            console.log(err);
        }
    }
 
}