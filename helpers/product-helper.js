var db = require('../config/connection')
var collection = require('../config/collections')
const { ObjectId } = require('mongodb')
var objectId = require('mongodb').ObjectId
module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.insertedId.toString())
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            // Find all products from database
            // let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            // Find all products which have delete status false
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({deletestatus:false}).toArray()
            resolve(products)
        })
    },

    deleteProduct: (proId)=>{
        return new Promise((resolve,reject)=>{
            //delete record
            // db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new objectId(proId)}).then((data)=>{
            //     resolve()
            // })

            //update delete status to true

            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},{$set:{deletestatus:true}}).then((data)=>{
                console.log(data)
                resolve()
            })
        })
    },

    getProductDetails: (proId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct: (proId, product)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(proId)},{$set:{
                name:product.name,
                category:product.category,
                description:product.description,
                price:product.price

            }}).then(()=>{
                resolve( )
            })
        })
    }
}
