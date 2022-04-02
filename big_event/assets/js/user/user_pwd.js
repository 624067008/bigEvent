$(function() {
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6-12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val())
                return '新密码不能与原密码一致'
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val())
                return '两次密码不一致'
        }
    })

    //更改密码表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0)
                    return layui.layer.msg('修改失败:' + res.message)
                layui.layer.msg('修改成功')
                    //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})