var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
var userHelper = require('../helpers/user-helper')
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products: products, user:user })
  })

});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.get('/signup', (req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{

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
      res.redirect('/login')
    }
  })
})


router.get('/logout', (req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
