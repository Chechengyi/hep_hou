var express = require('express');
var router = express.Router();
var multer = require('multer');
var models = require('../models/index.js')
var fs = require('fs')
// 图片保存路径

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

var upload = multer({
    storage: storage
})

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
    // if ( req.session.isLogin ) {
    //     models.Magazine.find(  function (err, magazine) {
    //
    //         res.send( JSON.stringify(magazine) )
    //     } )
    // } else {
    //    res.send('false')
    // }
    models.Magazine.find(  function (err, magazine) {

        res.send( JSON.stringify(magazine) )
    } )
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
        var newPath = 'uploads/' + req.file.originalname
        if ( req.session.isLogin ) {
            fs.rename( image, newPath, function (err) {
                if ( err ) {
                    throw err
                } else {
                    var m_id = req.body.m_id
                    models.Magazine.find({ m_id: m_id }).each( function (result) {
                        result.m_img = 'http://localhost:3000/'+newPath
                    } ).save( function (err) {
                        res.send('/'+newPath)
                    } )
                }
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
    var newPath = 'uploads/' + req.file.originalname
    fs.rename( image, newPath, function (err) {
        if (err) {
            throw err
        } else {
            if ( req.session.isLogin ) {
                // res.redirect('/magazines');
                var m_name = req.body.m_name
                var m_info = req.body.m_info
                models.Magazine.create({
                    m_name: m_name,
                    m_img: 'http://127.0.0.1:3000/' + newPath ,
                    m_info: m_info
                }, function (err, resulte) {
                    console.log(resulte)
                    res.redirect('/magazines')
                })
            } else {
                res.render('err', { content: '请先登录', url: '/users' })
            }
        }
    } )
})

router.get('/magazines/list', function (req, res, next) {
    if ( req.session.isLogin ) {
        var num = req.query.num
        var name = req.query.name
        res.render('users/magazinesList', { num: num, name: name })
    } else {
        res.render('err', { content: '请先登录', url: '/users' })
    }
} )

// 获取杂志的名字 和 杂志详情
router.get('/magazines/name', function (req, res, next) {
    var m_id = req.query.num
    models.Magazine.find( {m_id: m_id}, function (err, item) {
        res.send(JSON.stringify(item))
    } )
})

module.exports = router;
