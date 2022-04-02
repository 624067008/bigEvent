$(function() {
    //获取裁剪区的dom元素
    var $image = $('#image')
    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    //为文件选择框绑定change事件

    $('#file').on('change', function(e) {
        //获取用户选择的文件
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

    //为确定按钮绑定事件
    $('#btnUpload').on('click', function() {
        var dataURL = $image.cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('更换头像失败' + res)
                layui.layer.msg('更换头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})