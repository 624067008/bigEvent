$(function() {

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }
    initTable()
        //获取文章列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('获取文章列表失败')
                        //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类
    initCate()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('获取文章分类失败')

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //重新渲染（因为选择下拉框是后来加上的没被识别）
                    //rander是layui提供的重新渲染方法
                layui.form.render()
                    // layui.layer.msg('获取文章分类成功')
            }
        })
    }


    //筛选表单提交
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
            //重新渲染文章列表
        initTable()
    })


    //渲染分页方法
    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total //数据总数，从服务端得到
                ,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，触发jump回调
            //第一次render也会触发jump
            jump: function(obj, first) {
                // console.log(1);
                if (!first) {
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initTable()
                }
            }
        });
    }

    //删除文章

    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            var len = $('.btn-delete').length
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0)
                        return layui.layer.msg('删除文章失败')
                    layui.layer.msg('删除文章成功')
                        //应该先判断此页面是否还有数据
                        //如果没有页码应该减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })
        });
    })

    //编辑功能
    //把
    $('tbody').on('click', '.btn-edit', function() {
        location.href = '/article/art_pub.html?' + $('.btn-edit').attr('data-id')
    })
})