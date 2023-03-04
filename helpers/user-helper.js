var db = require('../config/connection')
var collections = require('../config/collections')
var bcrypt = require('bcrypt')
module.exports = {
    doSignup: (userdata) => {
        return new Promise(async(resolve, reject) => {

            userdata.password = await bcrypt.hash(userdata.password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userdata)
            resolve(userdata)
        })
    },

    doLogin:(userdata)=>{
        return new Promise(async(resolve, reject)=>{
            let loginstatus = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({email:userdata.email})
            if(user){
                bcrypt.compare(userdata.password, user.password).then((result)=>{
                    if(result){
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else{
                        resolve({status:false})
                    }
                })
            }
            else{
                resolve({status:false})
            }
        })
    }
} 