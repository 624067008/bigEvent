// 导入验证规则的包
const joi = require('joi')

// 定义用户名和密码的校验规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义id, nickname, email
const id = joi.number().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
    //定义登录规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 定义验证头像
const avatar = joi.string().dataUri().required()

//更新用户信息对象
exports.update_userinfo_schema = {
        body: {
            nickname,
            email
        }
    }
    //更改密码
exports.update_password_schema = {
    body: {
        oldPwd: password,
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

//头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}