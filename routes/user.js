const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
var userHelper = require('../helpers/user-helper')
/* GET home page. */


const verifyLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next()
  }
  else {
    res.redirect('/login')
  }
}
router.get('/', async function (req, res, next) {
  let user = req.session.user
  let cartCount = null
  if (req.session.loggedin) {
    cartCount = await userHelper.getCartCount(user._id)
  }
  console.log(cartCount)
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products: products, user: user, cartCount: cartCount })
  })

});

router.get('/login', (req, res) => {
  if (req.session.loggedin) res.redirect('/')
  res.render('user/login', { loginErr: req.session.loginErr })
  req.session.loginErr = false
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    req.session.loggedin = true
    req.session.user = response
    res.redirect('/')
  })
})


router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedin = true
      req.session.user = response.user
      res.redirect('/')
    }
    else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})


router.get('/cart', verifyLogin, (req, res) => {
  Promise.all([userHelper.getCartProducts(req.session.user._id), userHelper.getTotalAmount(req.session.user._id)]).then((result) => {
    res.render('user/cart', { user: req.session.user, cartItems: result[0], total:result[1] })
  })

})


router.get('/add-to-cart/:id', (req, res) => {
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
  })
})
,

router.post('/change-product-quantity', (req,res)=>{
  userHelper.changeProductQuantity(req.body).then((response)=>{
    res.json(response)
  })
}),

router.post('/deleteCartProduct',(req,res)=>{
  userHelper.deleteCartProduct(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/place-order',verifyLogin,(req,res)=>{
  userHelper.getTotalAmount(req.session.user._id).then((total)=>{
    res.render('user/place-order',{total})

  })
})

module.exports = router;
