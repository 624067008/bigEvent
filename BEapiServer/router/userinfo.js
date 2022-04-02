const express = require('express')
const router = express.Router()

//导入处理模块函数
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
    // 导入更改用户信息验证规则(用解构的方式)
    // 导入更改密码验证规则(用解构的方式)
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

const {} = require('../schema/user')
    //挂载路由
    //获取用户信息路由
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//更新用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
    //更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)


module.exports = router