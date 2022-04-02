//导入数据库操作模块

const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

//获取文章分类
module.exports.getArtCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by Id asc`
    db.query(sql, (err, results) => {
        if (err)
            return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results
        })
    })
}

//新增文章分类
module.exports.addArticleCates = (req, res) => {
    //查重
    const sql = `select * from ev_article_cate where name = ? or alias = ?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length === 2)
            return res.cc('分类名称和别名都被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称和别名都被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('别名被占用，请更换后重试')

        //插入
        const sql = `insert into ev_article_cate set ?`
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1)
                res.cc('增加文章分类失败')
            res.cc('增加文章分类成功', 0)
        })
    })
}

//删除文章
module.exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id = ?`

    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('删除文章分类失败')
        res.cc('删除文章分类成功', 0)
    })

}

//根据id获取文章分类
module.exports.getArtCateById = (req, res) => {
    const sql = `select * from ev_article_cate  where id = ?`
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取文章分类失败')
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        })
    })
}

module.exports.updateCateById = (req, res) => {
    const sql = `select * from ev_article_cate where id<>? and (name = ? or alias = ?)`
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length === 2)
            return res.cc('分类名称和别名都被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称和别名都被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('别名被占用，请更换后重试')
        const sql = `update ev_article_cate set ? where id = ?`
        db.query(sql, [req.body, req.body.id], (err, results) => {
            if (err)
                return res.cc(err)
            if (results.affectedRows !== 1)
                return res.cc('更新文章分类失败')
            res.cc('更新文章分类成功', 0)
        })
    })
}