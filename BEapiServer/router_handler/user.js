// 导入数据库操作模块
const db = require('../db/index')
    //导入bcrypt.js对密码进行加密
const bcrypt = require('bcryptjs')
    // 导入生成token的包
const jwt = require('jsonwebtoken')
    //导入全局配置文件
const config = require('../config')


// /注册新用户的处理函数
exports.regUser = (req, res) => {
        //获取客户端提交到服务器的用户信息
        const userinfo = req.body


        // 定义sql语句，查重
        const sqlStr = 'select * from ev_users where username =?'
        db.query(sqlStr, userinfo.username, (err, results) => {
            if (err) {
                return res.cc(err)
            }

            // 判断用户名是否重复
            if (results.length > 0)
                return res.cc('该用户名别占用，请跟换其他用户名')


            // 调用bcrypt对密码进行加密
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)

            //定义插入sql语句
            const sqlInsert = 'insert into ev_users set ?'
            db.query(sqlInsert, { username: userinfo.username, password: userinfo.password }, (err, results) => {
                if (err) {
                    return res.cc(err)
                }

                if (results.affectedRows !== 1)
                    return res.cc('注册失败，请稍后再试')
                res.cc('注册成功', 0)
            })
        })
    }
    //登录
exports.login = (req, res) => {
    const userinfo = req.body
        //定义sql
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('用户名不存在')
                //用客户端发送的密码与数据库的密码比对
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult)
            return res.cc('密码错误')

        //生成token
        //...结构运算符   后面password 和头像用空字符串覆盖 不写在token里面
        const user = {...results[0], password: '', user_pic: '' }
            //config是配置文件 expiresIn是tokcn的有效时长
        const tokenStr = jwt.sign(user, config.jwtSecretkey, { expiresIn: config.expiresIn })
            //将token响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            //Bearer 后面一定要跟一个空格
            token: 'Bearer ' + tokenStr
        })
    })
}