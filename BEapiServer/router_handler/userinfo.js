//获取用户基本信息处理函数
// 导入数据库模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

// 导入密码加密模块
const bcrypt = require('bcryptjs')
    // 查询用户信息
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的sql语句
    const sql = `select id ,username,nickname,email,user_pic from ev_users where id = ?`
        //解析token后jwt帮我们自动挂载的req.user  可以取出id
    db.query(sql, req.user.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取用户信息失败')
        res.send({
            status: 0,
            massage: '获取用户信息成功',
            data: results[0]
        })
    })
}

//更新用户信息
exports.updateUserInfo = (req, res) => {
    //定义sql
    const sql = 'update ev_users set ? where id = ?'
    db.query(sql, [req.body, req.user.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc(results)
        res.cc('更新用户信息成功', 0)
    })
}

//更改密码
exports.updatePassword = (req, res) => {
        const sql = 'select * from ev_users where id = ?'
        db.query(sql, req.user.id, (err, results) => {
            if (err)
                return res.cc(err)
            if (results.length !== 1)
                return res.cc('用户不存在')

            //判断旧密码是否正确
            const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
            if (!compareResult)
                return res.cc('原密码错误')

            // 更新密码sql语句
            const sqlUpdate = `update ev_users set password=? where id=?`
                //加密新密码
            const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

            db.query(sqlUpdate, [newPwd, req.user.id], (err, results) => {
                if (err)
                    return res.cc(err)
                if (results.affectedRows !== 1)
                    return res.cc('更新密码失败')
                res.cc('更新密码成功', 0)
            })
        })
    }
    //更新头像
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('更新头像失败')
        res.cc('更新头像成功', 0)
    })
}