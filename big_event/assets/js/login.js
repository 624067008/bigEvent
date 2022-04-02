$(function() {
    //点击注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui获取form对象,用layui的表单验证，提示信息
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            //获取pwd里面的值
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
        e.preventDefault()
            //post的数据
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0)
                return layer.msg(res.message)
            layer.msg('注册成功，请登录')
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').on('submit', e => {
        e.preventDefault()
        var data = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //jquery里的方法快速获取表单数据
            data: data,
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg(res.message)
                layer.msg('登录成功')
                    //将登录成功的token存到本地
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})