var db = require('../config/connection').get()
module.exports = {
    addProduct: (product)=>{
        db.collection('products').insertOne(product)
    }
}
