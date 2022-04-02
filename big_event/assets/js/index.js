$(function() {
    getUserInfo()

    //绑定退出点击事件
    $('#btnLogout').on('click', function() {
        layui.layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {

            localStorage.removeItem('token')
            location.href = '/login.html'

            //关掉询问框
            layer.close(index);
        });
    })
})


function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0)
                return layui.layer.msg('获取用户信息失败')
                    //调用渲染头像函数
            renderAvatar(res.data)
        },
        // //jquery封装的：无论成功失败都调用的cb函数
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //             //2.强制跳转登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户头像
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
            //获取名字的一个字母作为文本头像
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}