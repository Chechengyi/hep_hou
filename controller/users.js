var express = require('express');
var router = express.Router();
var models = require('../models/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/login');
});

// 请求登录
router.post('/login', function (req, res, next) {
    // models.User.find( {id: 2}, function (err, user ) {
    //     console.log(user)
    // } )
    // res.render('users/index')
    var username = req.body.username
    var password = req.body.password
    console.log(password)
    models.User.find( {username: username, password: password }, function (err, user) {
      if ( user.length == 0 ) {
        res.render('err', {content: '用户名或密码错误', url: '/users'})
      } else {
        req.session.isLogin = true
        res.redirect( '/magazines' )
      }
    } )
})




module.exports = router;
