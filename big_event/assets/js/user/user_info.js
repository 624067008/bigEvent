$(function() {
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6)
                return '昵称长度必须在1-6个字符之间'
        }
    })
    initUserInfo()

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    //监听用户信息表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: {
                id: $('#idval').val(),
                nickname: $('#nicknameval').val(),
                email: $('#emailval').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败')
                }
                layui.layer.msg('更新用户信息成功')
                    //window.parent 返回子窗口的父窗口
                window.parent.getUserInfo()
            }
        })
    })
})


//初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0)
                return layui.layer.msg('获取用户信息失败')

            //layuiform定义的方法 将获取的数据填入表单 lay-firter属性
            layui.form.val('formUserInfo', res.data)
        }
    })
}