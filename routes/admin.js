var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    res.render('admin/view-products', { admin: true, products: products })
  })

});


router.get('/add-product', function (req, res) {
  res.render('admin/add-product', { admin: true })
})


router.post('/add-product', (req, res) => {
  let prodcut = req.body
  product.price = parseInt(prodcut.price)
  prodcut.deletestatus = false
  productHelper.addProduct(prodcut, (id) => {
    let image = req.files.image
    image.mv('./public/images/product-images/' + id + '.jpg', (err, done) => {
      if (!err) { res.render('admin/add-product', { admin: true }) }
      else { console.log(err) }
    })

  })

})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((data) => {
    res.redirect('/admin')
  })

})


router.get('/edit-product/:id', (req, res) => {
  productHelper.getProductDetails(req.params.id).then((product) => {
    res.render('admin/edit-product', { product: product })
  })
})


router.post('/edit-product/:id', (req, res) => {
  let product = req.body
  product.price = parseInt(product.price)
  productHelper.updateProduct(req.params.id, product).then(() => {
    res.redirect('/admin')
    try {
      let img = req.files.image
      img.mv('./public/images/product-images/' + req.params.id + '.jpg')
    }
    catch {

    }
  })
})
module.exports = router;
