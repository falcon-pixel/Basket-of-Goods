var db = require('../config/connection')
var collections = require('../config/collections')
var bcrypt = require('bcrypt')
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
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).findOne({ user: new objectId(userId) }).then((result) => {
                if (result) {
                    db.get().collection(collections.CART_COLLECTION).updateOne({ user: new objectId(userId) }, { $push: { products: new objectId(proId) } })
                    resolve()
                }
                else {
                    cartObj = { user: new objectId(userId), products: [new objectId(proId)] }
                    db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((result) => {
                        resolve()
                    })
                }
            })
        })
    },
    getCartProducts: (userId) => {
        return new Promise( async(resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: new objectId(userId) }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        let: { proList: '$products' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$proList']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray()

            resolve(cartItems[0].cartItems)
        })
    }
} 