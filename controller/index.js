var express = require('express');
var router = express.Router();
var multer = require('multer');
var models = require('../models/index.js')
// 图片保存路径
var upload = multer({ dest: 'uploads/' })

// 进入主页内容页面
router.get('/magazines', function (req, res, next) {
    if ( req.session.isLogin ) {
        res.render('users/index')
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

// 获取杂志信息
router.get('/magazines/get', function (req, res, next) {
    if ( req.session.isLogin ) {
        models.Magazine.find(  function (err, magazine) {

            res.send( JSON.stringify(magazine) )
        } )
    } else {
       res.send('false')
    }
})

// 杂志管理页面
router.get('/magazines/change', function (req, res, next) {

    // res.render( 'users/magazineWrite' )
    if ( req.session.isLogin ) {
        var num = req.query.num
        // res.render( 'users/magazineWrite' )
        models.Magazine.find( {m_id: num}, function (err, item) {
            res.render( 'users/magazineWrite', { magazine: JSON.stringify(item) } )
        } )

    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})


// 更改杂志封面图片
router.post('/magazines/img',upload.single("m_img"), function (req, res, next) {
        var image = req.file.path
        if ( req.session.isLogin ) {
            var m_id = req.body.m_id
            models.Magazine.find({ m_id: m_id }).each( function (result) {
                result.m_img = '/'+image
            } ).save( function (err) {
                res.send('/'+image)
            } )
        } else {
            res.send('false')
        }
})
// 更改杂志信息
router.post('/magazines/info', function (req, res, next) {
    // var m_name = req.body.m_name
    // var m_info = req.body.m_info
    // console.log(m_info)
    // res.send(m_info)
    if ( req.session.isLogin ) {
        var m_name = req.body.m_name
        var m_info = req.body.m_info
        var m_id = req.body.m_id
        models.Magazine.find({ m_id: m_id }).each(function (result) {
            result.m_name = m_name
            result.m_info = m_info
        }).save( function (err) {
            if ( err ) {
                res.send('false')
            } else {
                res.send( 'true' )
            }
        } )
    }
})

// 删除杂志
router.get('/magazines/remove', function (req, res, next) {
    var num = req.query.num

    if ( req.session.isLogin ) {
        models.Magazine.find({ m_id: num }).remove(function (err) {
            res.redirect('/magazines')
        })
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})
// 添加杂志页面
router.get('/magazines/add', function (req, res, next) {
    if ( req.session.isLogin ) {
        res.render('users/magazinesAdd')
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})
// 添加杂志请求
router.post('/magazines/add', upload.single("m_img"), function (req, res, next) {
    var image = req.file.path
    // console.log(req.file)
    if ( req.session.isLogin ) {
        // res.redirect('/magazines');
        var m_name = req.body.m_name
        var m_info = req.body.m_info
        models.Magazine.create({
            m_name: m_name,
            m_img: '/' + image,
            m_info: m_info
        }, function (err, resulte) {
            console.log(resulte)
            res.redirect('/magazines')
        })
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
})

router.get('/magazines/list', function (req, res, next) {
    if ( req.session.isLogin ) {
        var num = req.query.num
        res.render('users/magazinesList', { num: num })
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
} )

module.exports = router;
