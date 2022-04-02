$(function() {
    //如果是在文章列表打开当前页面
    //将面板标题修改为修改文章
    if (parent.$('.artList', window.parent.document)[0].classList == 'artList layui-this') {
        $('.layui-card-header').html('修改文章')

    }

    initCate()
    initEditor()
        //初始化文章类别
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('初始化文章分类失败')
                        //模板引擎渲染菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                layui.form.render()
            }
        })
    }

    // 初始化图片加载器
    var $image = $('#image')

    // 裁剪选项
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }
    $image.cropper(options)

    //如果在文章列表打开当前页面
    //自动填充表单
    if (parent.$('.artList', window.parent.document)[0].classList == 'artList layui-this') {
        setTimeout(() => {
            //获取id
            var id = location.href.split('?')[1]
            $.ajax({
                mehtod: 'get',
                url: '/my/article/' + id,
                success: function(res) {
                    //layui自动填入表单
                    layui.form.val("form-pub", res.data);
                    //将文章内容填入
                    document.getElementById('content_ifr').contentWindow.document.getElementById('tinymce').innerHTML = res.data.content
                }
            })

        }, 500)



    }
    //选择封面
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {


        var filelist = e.target.files
        if (filelist.length === 0)
            return layui.layer.msg('请选择照片')

        // 切换选择框里面的图片
        var file = filelist[0]
        var imgURL = URL.createObjectURL(file)
            //重新初始化裁剪区
        $image.cropper('destroy')
            .attr('src', imgURL)
            .cropper(options)
    })


    //定义文章状态
    var art_state = '已发布'

    //储存草稿点击
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //发布
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])


        //将封面裁剪过的图输出为文件对象
        $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 200
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob)
            })
        fd.append('state', art_state)
        setTimeout(() => {
            publishArticle(fd)
        }, 1000);

    })

    //发布文章方法
    function publishArticle(fd) {
        // async： 异步属性， 如果是true的话， 嵌套的ajax也会异步（ 和外层的ajax同时） 执行， 这时候可能会造成数据没有获取到， 或者获取到错误的数据信息， 造成异常。
        $.ajax({
            async: false,
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //如果提交的是formData格式的数据
            //必须加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0)
                    return layui.layer.msg('发布文章失败')
                layui.layer.msg('发布文章成功')
                    //如果是修改文章 应该删除原来的文章
                if (parent.$('.artList', window.parent.document)[0].classList == 'artList layui-this' && location.href.indexOf('?')) {
                    let id = location.href.split('?')[1]
                    $.ajax({
                        async: false,
                        method: 'get',
                        url: '/my/article/delete/' + id,
                        success: function(res) {
                            if (res.status !== 0) {
                                return res.message
                            }
                        }
                    })
                }
                // location.href = '/article/art_list.html'
                //模拟文章列表点击事件
                parent.$('#artList', window.parent.document)[0].click()
            }
        })
    }
})