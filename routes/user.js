var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
var userHelper = require('../helpers/user-helper')
/* GET home page. */


const verifyLogin= (req,res,next)=>{
  if(req.session.loggedin){
    next()
  }
  else{
    res.redirect('/login')
  }
}
router.get('/', function (req, res, next) {
  let user = req.session.user
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products: products, user:user })
  })

});

router.get('/login',(req,res)=>{
  if(req.session.loggedin)res.redirect('/')
  res.render('user/login',{loginErr:req.session.loginErr})
  req.session.loginErr = false
})

router.get('/signup', (req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
     req.session.loggedin= true
     req.session.user = response
    res.redirect('/')
  })
})


router.post('/login', (req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedin = true
      req.session.user = response.user
      res.redirect('/')
    }
    else{
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})


router.get('/logout', (req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})


router.get('/cart',verifyLogin, (req,res)=>{
  userHelper.getCartProducts(req.session.user._id).then((result)=>{
    console.log(result)
    res.render('user/cart',{user:req.session.user, cartItems:result})
  })
 
})


router.get('/add-to-cart/:id',verifyLogin, (req,res)=>{
  userHelper. addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})

module.exports = router;
