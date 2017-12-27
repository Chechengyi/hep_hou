var express = require('express');
var router = express.Router();
var multer = require('multer');
var models = require('../models/index.js')



// 查询杂志文章列表信息 返回给前台
router.get('/', function (req, res, next ) {
    var num = req.query.num
    console.log( '...........' + num )
    console.log(num)
    models.Doclist.find( { m_id: parseInt(num) }, function (err, items) {
        res.send(JSON.stringify(items))
    } )
} )

// 给杂志添加文章页面
router.get('/add', function (req, res, next) {
    if ( req.session.isLogin ) {
        var num = req.query.num
        res.render('doclist/addDoclist', {num: num} )
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})
// 给杂志添加文章请求
router.post('/add', function (req, res, next) {
    var m_id = req.body.num
    var title = req.body.title
    var cont = req.body.cont
    console.log(cont)
    if ( req.session.isLogin ) {
        // res.redirect('/magazines/list?num=' +m_id )
        models.Doclist.create({
            m_id: m_id,
            title: title,
            cont: cont
        }, function (err) {
            res.redirect('/magazines/list?num=' +m_id )
        } )
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

// 查看杂志文章页面
router.get('/seedoc', function (req, res, next) {
    var num = req.query.num
    res.render( 'doclist/doc', {num: num} )
})

// 查看杂志文章信息
router.get('/getdoc', function (req, res, next) {
    
})

module.exports = router;