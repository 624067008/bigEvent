$(function() {
    //获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()

    //添加类别
    var indexAdd = null
    $('#addCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    //通过代理的方式为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: {
                name: $('[name=name]').val(),
                alias: $('[name=alias]').
                val()
            },
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('添加类别失败')
                layui.layer.msg('添加类别成功')
                initArtCateList()
                    //关闭弹出层
                layui.layer.close(indexAdd)
            }
        })
    })

    //编辑类别
    var indexEdit = null
    $('tbody').on('click', '#btnEdit', function() {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val('form-edit', res.data)
            }
        })
    })


    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('编辑分类失败')
                layui.layer.msg('编辑分类成功')
                initArtCateList()
                    //关闭弹出层
                layui.layer.close(indexEdit)
            }
        })
    })

    //删除分类
    $('body').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id')
            //提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0)
                        return layui.layer.msg('删除分类失败')
                    layui.layer.msg('删除分类成功')
                    initArtCateList()
                    layui.layer.close(index)
                }
            })

        })
    })
})