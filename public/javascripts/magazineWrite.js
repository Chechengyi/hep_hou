window.addEventListener('DOMContentLoaded', function () {
    var type = 'flie' ;   // 标识上传图片类型
    ;(function () {
        // 获取元素节点并且初始化好
        var btn1 = $('#choose-1').addClass('active')
        var btn2 = $('#choose-2')
        var choose1 = $('#choose-1-res').css('display', 'block')
        var choose2 = $('#choose-2-res').css('display', 'none')

        btn1.click( function (e) {
            type = 'file'
            e.preventDefault()
            btn1.addClass('active')
            btn2.removeClass('active')
            choose1.css('display', 'block')
            choose2.css('display', 'none')
        } )
        btn2.click( function (e) {
            type = 'anchor'
            e.preventDefault()
            btn2.addClass('active')
            btn1.removeClass('active')
            choose2.css('display', 'block')
            choose1.css('display', 'none')
        })
    })();

    // 更换封面图片
    $('#imgBtn').click(function () {

        var fm = new FormData()

        if ( !(document.getElementById('m_img').files.length !== 0 || $('#m_img_anchor').val()) ) {
            alert('请上传图片文件')
            return false
        }

        fm.append('m_id', document.getElementById('m_id').value)

        if ( type == 'file' ) {
            file()
            console.log('file')
        } else {
            console.log('aaa')
            anchor()
        }

        // 发送本地图片请求
        function file () {
            fm.append('m_img', document.getElementById('m_img').files[0])
            $.ajax( {
                url: '/magazines/img',
                type: 'post',
                data: fm,
                contentType: false, //禁止设置请求类型
                processData: false, //禁止jquery对DAta数据的处理,默认会处理
                success: function (res) {
                    console.log(res)
                    $('#img').attr('src', res)
                }
            } )
        }
        // 发送链接图片请求
        function anchor () {
            // fm.append('m_img', $('#m_img_anchor').val())
            $.ajax( {
                url: '/magazines/img',
                type: 'post',
                data: {
                    m_img_anchor: $('#m_img_anchor').val(),
                    m_id: document.getElementById('m_id').value
                } ,
                success: function (res) {
                    console.log(res)
                    $('#img').attr('src', res)
                }
            } )
        }

    })

    // 修改信息
    $('#btn').click(function () {


        console.log($('#m_name').val())

        $.ajax( {
            url: '/magazines/info',
            type: 'post',
            data: {
                m_name: $('#m_name').val(),
                m_info: CKEDITOR.instances.m_info.getData(),
                m_id: $('#m_id').val()
            },
            success: function (res) {
                if (res) {
                    swal("修改成功", "", "success")
                } else {
                    swal("修改失败", "error")
                }
            }
        } )
    })

})