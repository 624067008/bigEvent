const express = require('express')
const router = express.Router()
    //导入用户路由处理函数模块
const user_handler = require('../router_handler/user')

//导入验证数据的中间件(提供利用验证规则自动验证的方法)
const expressJoi = require('@escook/express-joi')
    //导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')


//注册新用户
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

//登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router