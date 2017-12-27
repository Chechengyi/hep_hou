var orm = require('orm')
var url = require('../database.congif')

var models = {}

orm.connect( url, function (err, db) {

    if ( err ) {
        console.log(err)
    } else {
        console.log("数据库连接成功")
        // user表
        models.User = db.define("user", {
            id: { type: 'serial', key: true },
            username: String,
            password: String
        })
        models.Magazine = db.define("magazine", {
            m_id: { type: 'serial', key: true },
            m_name: String,
            m_img: String,
            m_info: String
        })
        models.Doclist = db.define("doc", {
            t_id: { type: 'serial', key: true },
            m_id: Number,
            title: String,
            cont: String
        })
    }

} )

module.exports = models
