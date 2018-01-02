var express = require('express');
var router = express.Router();
var multer = require('multer');
var models = require('../models/index.js')
var fs = require('fs')
var rootPath = require('../rootPath')
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
    if ( req.query.page && req.query.num ) {
        var offset = req.query.page * req.query.num
        var num = req.query.num
        console.log(offset)
        console.log(num)
        models.Magazine.find().limit(parseInt(num)).offset(offset).run( function (err, magazine) {
            if ( magazine.length !==0 ) {
                console.log(magazine.length)
                res.send( JSON.stringify(magazine) )
            } else {
                res.send('false')
            }
        } )

    } else {
        models.Magazine.find( function (err, magazine) {
            // res.send( JSON.stringify(magazine.reverse()) )
            res.send( JSON.stringify( magazine.reverse() ) )
        } )
        // models.Magazine.find().limit(5).offset(5).run( function (err, magazine) {
        //     res.send( JSON.stringify(magazine.reverse()) )
        // } )
    }
})

// 获取杂志信息 懒加载  为了实现从后往前查询 加过滤查询
router.get('/magazines/get1', function (req, res, next) {
    var page = parseInt(req.query.page)
    var num  = parseInt(req.query.num)
    models.Magazine.find().count( function (err, counts) {
        var offset = counts - ( page * num )
        if ( offset >= 0 ) {
            models.Magazine.find().limit(num).offset(offset).run( function (err2, magazine) {
                // res.send(JSON.stringify(magazine.reverse()))
                if ( magazine.length == 0  ) {
                    res.send('false')
                } else {
                    res.send(JSON.stringify(magazine.reverse()))
                }
            } )
        } else if ( -num < offset && offset < 0 )  {
            num = num + offset
            models.Magazine.find().limit(num).offset(0).run( function (err2, magazine) {
                res.send( JSON.stringify(magazine.reverse()) )
            } )
        } else if ( offset <= -num ) {
            res.send('false')
        }
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
        var m_id = req.body.m_id
        if ( ! req.body.m_img_anchor ) {   // 修改杂志封面上传的是本地图片
            var image = req.file.path
            var newPath = 'uploads/' + req.file.originalname
            fs.rename( image, newPath, function (err) {
                if (err) {
                    throw err
                } else {
                    if ( req.session.isLogin ) {
                        // res.redirect('/magazines');
                        models.Magazine.find( {m_id: m_id} ).each( function (result) {
                            result.m_img = rootPath + '/' + newPath
                        } ).save( function (err2) {
                            res.send('/' +newPath )
                        } )
                    } else {
                        res.send('false')
                    }
                }
            } )
        } else {
            var newPath = req.body.m_img_anchor
            console.log(newPath)
            if ( req.session.isLogin ) {
                // res.redirect('/magazines');
                models.Magazine.find( {m_id: m_id} ).each( function (result) {
                    result.m_img = newPath
                } ).save( function (err2) {
                    res.send( newPath )
                } )
            } else {
                res.send('false')
            }
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

    if (! req.body.m_img_anchor) {  // 上传的图片是本机图片的处理
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
                        m_img: rootPath + '/' + newPath ,
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
    } else {   // 上传图片是链接的处理
        var newPath = req.body.m_img_anchor
        if ( req.session.isLogin ) {
            // res.redirect('/magazines');
            var m_name = req.body.m_name
            var m_info = req.body.m_info
            models.Magazine.create({
                m_name: m_name,
                m_img:  newPath ,
                m_info: m_info
            }, function (err, resulte) {
                console.log(resulte)
                res.redirect('/magazines')
            })
        } else {
            res.render('err', { content: '请先登录', url: '/users' })
        }
    }

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
