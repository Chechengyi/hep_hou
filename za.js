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