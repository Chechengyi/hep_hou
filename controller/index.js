var express = require('express');
var router = express.Router();

var models = require('../models/index.js')

router.get('/magazines', function (req, res, next) {
    models.Magazine.find( 1, function (err, magazine) {

        res.send( JSON.stringify(magazine) )
    } )
})

router.get('/magazines/change', function (req, res, next) {

    // res.render( 'users/magazineWrite' )
    if ( req.session.isLogin ) {
        res.render( 'users/magazineWrite' )
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

module.exports = router;
