window.addEventListener('DOMContentLoaded', function () {

    // 获取文章信息请求
    $.ajax({
        url: '/doclist/getdoc',
        type: 'get',
        data: {
            num: $('#num').text()
        },
        success: function (res) {
            console.log(res)
            render(JSON.parse(res))
            renderChange(JSON.parse(res))
        }
    })

    // 渲染文章展示 dom结构
    function render (data) {
        var html = '<h3 class="text-center" >'+ data[0].title+ '</h3>' +
            '<p>'+data[0].cont+'</p>'
        $('#back').css('display', 'none')
        $('#content1').html(html)

    }
    // 渲染文章 修改 dom 结构
    function renderChange (data) {
        $('#doc_title').val(data[0].title)
        $('#doc_cont').val(data[0].cont)
        // console.log(1)
        // document.getElementById('doc_title').value = data[0].title
    }


    $('#sub-btn').click( function () {
        if ( !($('#doc_title').val() && CKEDITOR.instances.doc_cont.getData()) ) {
            swal('请完善文章信息')
        }
    } )
    // 修改文章按钮点击  文章展示关闭  修改界面显示
    $('#c_btn').click( function () {
        $('#back').css('display', 'inline')
        $('#content1').css('display', 'none')
        $('#content2').css('display', 'block')
    } )

    $('#back').click(function () {
        $('#back').css('display', 'none')
        $('#content1').css('display', 'block')
        $('#content2').css('display', 'none')
    })


})