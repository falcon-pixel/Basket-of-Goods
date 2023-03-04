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
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image
    image.mv('./public/images/product-images/' + id + '.jpg', (err, done) => {
      if (!err) { res.render('admin/add-product', { admin: true }) }
      else { console.log(err) }
    })

  })

})
module.exports = router;
