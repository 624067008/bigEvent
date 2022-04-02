//导入 express
const express = require('express')

//创建服务器实例对象
const app = express()
    //制作验证规则 测试是否通过规则的方法
const joi = require('joi')
    //导入并配置cors中间件跨域
const cors = require('cors')
app.use(cors())

//配置解析表单的中间件 数据格式:applicationx-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//在路由前封装res.cc函数(用来简化重复多次的res.send操作)
app.use((req, res, next) => {
    // status默认为1请求表示失败
    //err值可能是错误对象 也可能是错误是描述字符串
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//导入解析token的中间件  一定要在路由前
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretkey }).unless({ path: [/^\/api\//] }))


//导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//导入文章分类路由
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
    //导入文章路由
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//定义错误级别中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if (err instanceof joi.ValidationError)
        return res.cc(err)
            //jwt身份认证失败的错误
    if (err.name === 'UnauthorizedError')
        return res.cc('身份认证失败')
            //未知错误
    res.cc(err)
})


//启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})