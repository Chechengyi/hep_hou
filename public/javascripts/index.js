window.addEventListener('DOMContentLoaded', function () {

    var magazineDom = document.getElementById('magazine-list-box')

    $.ajax( {
        url: '/magazines',
        type: 'get',
        success: function (res) {
            var data = JSON.parse(res)
            render(data)
        }
    } )

    function render (data) {
        var html = ''
        for ( var i=0 ;i<data.length; i++ ) {
            html += '<div class="magazine-item" >' +
                  '<div class="magazine-img" >' +
                '<img src="' + data[i].m_img +  '"/>' +
                '</div>'+
                '<div class="magazine-info" >' +
                '<p>杂志名：' + data[i].m_name + ' </p>' +
            '<div>' +
            '<a href="/magazines/change?num= '+data[i].m_id + '" class="btn btn-info btn-xs" >修改</a>' +
                '<a href="' + '" class="btn btn-success btn-xs btn-r" >编辑</a>' +
                '<a href="' + '" class="btn btn-danger btn-xs btn-r" >删除</a>' +
                '</div>'
                '</div>'
                '</div>'
        }

        magazineDom.innerHTML = html
    }
})