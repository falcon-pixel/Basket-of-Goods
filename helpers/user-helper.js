var db = require('../config/connection')
var collections = require('../config/collections')
var bcrypt = require('bcrypt')
const { response } = require('express')
var objectId = require('mongodb').ObjectId
module.exports = {
    doSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {

            userdata.password = await bcrypt.hash(userdata.password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userdata)
            resolve(userdata)
        })
    },

    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userdata.email })
            if (user) {
                bcrypt.compare(userdata.password, user.password).then((result) => {
                    if (result) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        resolve({ status: false })
                    }
                })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    addToCart: (proId, userId) => {
        let proObj = {
            item: new objectId(proId),
            quantity: 1
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).findOne({ user: new objectId(userId) }).then((result) => {
                if (result) {
                    console.log(result)
                    let ProExist = result.products.findIndex(product => product.item == proId)
                    if (ProExist != -1) {
                        db.get().collection(collections.CART_COLLECTION).updateOne({ user: new objectId(userId), 'products.item': proObj.item }, { $inc: { 'products.$.quantity': 1 } }).then((data) => resolve())
                    }
                    else {
                        db.get().collection(collections.CART_COLLECTION).updateOne({ user: new objectId(userId) }, { $push: { products: proObj } }).then((data) => resolve())
                    }

                    // db.get().collection(collections.CART_COLLECTION).updateOne({ user: new objectId(userId) }, { $push: { products: new objectId(proId) } })
                    // resolve()
                }
                else {
                    cartObj = { user: new objectId(userId), products: [proObj] }
                    db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((result) => {
                        resolve()
                    })
                }
            })
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([

                {
                    $match: { user: new objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$products', 0] }
                    }
                }
                // {
                //     $match: { user: new objectId(userId) }
                // },
                // {
                //     $lookup: {
                //         from: collections.PRODUCT_COLLECTION,
                //         let: { proList: '$products' },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $in: ['$_id', '$$proList']
                //                     }
                //                 }
                //             }
                //         ],
                //         as: 'cartItems'
                //     }
                // }
            ]).toArray()
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise((resolve, reject) => {
            let count = 0
            db.get().collection(collections.CART_COLLECTION).findOne({ user: new objectId(userId) }).then((cart) => {
                if (cart) {
                    count = cart.products.length
                }
                resolve(count)
            })
        })
    },
    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                console.log(details)
                db.get().collection(collections.CART_COLLECTION).updateOne(
                    {
                        _id: new objectId(details.cart)
                    },
                    {
                        $pull: { products: { item: new objectId(details.product) } }
                    }).then((response) => resolve({ removeProduct: true }))
            }
            else {
                db.get().collection(collections.CART_COLLECTION).updateOne({ _id: new objectId(details.cart), 'products.item': new objectId(details.product) }, { $inc: { 'products.$.quantity': details.count } }).then((data) => resolve(true)
                )
            }
        })
    },
    deleteCartProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne(
                {
                    _id: new objectId(details.cart)
                },
                {
                    $pull: { products: { item: new objectId(details.product) } }
                }
            ).then((response) => resolve({ deleteProduct: true }))
        })
    },


    getTotalAmount:  (userId) => {
        return new Promise(async(resolve, reject) => {
            let total = await db.get().collection(collections.CART_COLLECTION).aggregate([

                {
                    $match: { user: new objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$products', 0] }
                    }
                },
                {
                    $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$product.price'] } } }
                }
            ]).toArray()
            resolve(total[0].total)
        })

    }
} 