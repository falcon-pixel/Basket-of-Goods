var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: 'S23 Ultra',
      category: 'Mobile',
      img: 'https://images.samsung.com/in/smartphones/galaxy-s23-ultra/buy/product_color_phantom_black.png?imwidth=480'
    },
    {
      name:'Iphone 13',
      category:'Mobile',
      img:'https://www.myg.in/images/thumbnails/624/460/detailed/21/APPLE_iPhone_13-2.jpeg'
    },
    {
      name:'Redmagic 7',
      category:'Mobile',
      img:'https://cdn.shopify.com/s/files/1/0024/0684/2441/files/tile_1_2x_61af57cd-fa43-42a5-a1b2-c7401f327483.jpg?v=1672929646&width=1200'
    }
  ]
  res.render('index', { products:products, admin:false });
});

module.exports = router;
