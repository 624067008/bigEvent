//调用jquery ajax请求 会先调用这个函数这是jquery规定的
//可以拿到ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    //发请求时统一评接根路径

    // options.url = 'http://www.liulongbin.top:3007' + options.url
    options.url = 'http://127.0.0.1:3007' + options.url
        //统一为有权限的接口设置header请求
    if (options.url.indexOf('/my') !== -1)
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    //jquery封装的：发出ajax请求后无论成功失败都调用的cb函数complete
    options.complete = function(res) {
        // console.log(res);

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空token
            localStorage.removeItem('token')
                //2.强制跳转登录页面
            location.href = '/login.html'
        }
    }
})