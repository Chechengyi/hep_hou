var express = require('express');
var router = express.Router();
var multer = require('multer');
var models = require('../models/index.js')



// 查询杂志文章列表信息 返回给前台
router.get('/', function (req, res, next ) {
    var num = req.query.num
    console.log(num)
    models.Doclist.find( { m_id: parseInt(num) }, function (err, items) {
        res.send(JSON.stringify(items.reverse()))
    } )
} )
// 查询文章信息，从后往前查， 做分页查询
router.get('/1', function (req, res, next) {
    var page = parseInt( req.query.page )
    var num =  parseInt( req.query.num ) // 每次查询几条
    var id = parseInt( req.query.id )  // 查询文章的id
    console.log(id)
    models.Doclist.find( { m_id: id } ).count( function (err, counts) {
        var offset = counts - ( page * num )
        if ( offset >= 0 ) {
            models.Doclist.find( { m_id: id } ).limit(num).offset(offset).run( function (err2, doc) {
                // res.send(JSON.stringify(magazine.reverse()))
                if ( doc.length == 0  ) {
                    res.send('false')
                } else {
                    console.log( '+++++++' + doc.length)
                    res.send(JSON.stringify(doc.reverse()))
                }
            } )
        } else if ( -num < offset && offset < 0 )  {
            num = num + offset
            models.Doclist.find( { m_id: id } ).limit(num).offset(0).run( function (err2, doc) {
                res.send( JSON.stringify(doc.reverse()) )
            } )
        } else if ( offset <= -num ) {
            res.send('false')
        }
    } )
})

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
    var num = req.query.num
    // res.send(num)
    models.Doclist.find( {t_id: num}, function (err, item) {
        res.send( JSON.stringify(item) )
    } )
})

// 修改文章信息
router.post('/changedoc', function (req, res, next) {
    if ( req.session.isLogin ) {
        var num = req.body.num
        var title = req.body.title
        var cont = req.body.cont
        // res.redirect('/doclist/seedoc?num='+num)
        models.Doclist.find( {t_id: num} ).each( function (result) {
            result.title = title
            result.cont = cont
        } ).save( function (err) {
            res.redirect('/doclist/seedoc?num='+num)
        } )

    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

// 删除文章
router.get('/remove', function (req, res, next) {
    if ( req.session.isLogin ) {
        var num = req.query.num
        var pnum = req.query.pnum
        // res.redirect('/magazines/list?num=' +pnum)
        models.Doclist.find({t_id: num}).remove( function (err) {
            res.redirect('/magazines/list?num=' +pnum)
        } )
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

module.exports = router;