window.addEventListener('DOMContentLoaded', function () {


    // 更换封面图片
    $('#imgBtn').click(function () {

        var fm = new FormData()

        if (document.getElementById('m_img').files.length == 0) {
            alert('请上传图片文件')
            return false
        }

        fm.append('m_img', document.getElementById('m_img').files[0])
        fm.append('m_id', document.getElementById('m_id').value)

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