const db = require('../db/index')

module.exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img')
        return res.cc('文章封面是必选参数！')

    // 导入处理路径的 path 核心模块
    const path = require('path')

    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`

    console.log(req.file);
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        // 发布文章成功
        res.cc('发布文章成功', 0)
    })

}

module.exports.getArtlist = (req, res) => {
    let total = null
    const a = (req.query.pagenum - 1) * req.query.pagesize
    const b = req.query.pagesize
        // if (req.query.cate_id === '' && req.query.state === '') {
    let sqltt = ``
    let sql = ''
    if (req.query.cate_id === '' && req.query.state === '') {
        sqltt = 'select * from ev_articles where is_delete = 0'
        sql = `select ev_articles.Id ,ev_articles.title,ev_articles.pub_date,ev_article_cate.name,ev_articles.state from ev_articles,ev_article_cate where ev_articles.cate_id=ev_article_cate.Id and ev_articles.is_delete = 0 LIMIT ?,?`
        db.query(sqltt, [req.query.state], (err, results) => {
            if (err)
                return res.cc(err)
            total = results.length
                // console.log(req.query);
            db.query(sql, [a, b], (err, results) => {
                if (err)
                    return res.cc(err)
                        // console.log(req.query);
                res.send({
                    status: 0,
                    message: '查询成功',
                    data: results,
                    total: total
                })
            })
        })
    } else if (req.query.cate_id === '' && req.query.state !== '') {
        sqltt = 'select * from ev_articles where ev_articles.state =?  and ev_articles.is_delete = 0'
        sql = `select ev_articles.Id ,ev_articles.title,ev_articles.pub_date,ev_article_cate.name,ev_articles.state from ev_articles,ev_article_cate where ev_articles.cate_id=ev_article_cate.Id and ev_articles.state =?  and ev_articles.is_delete = 0 LIMIT ?,?`
        db.query(sqltt, [req.query.state], (err, results) => {
            if (err)
                return res.cc(err)
            total = results.length
                // console.log(req.query);
            db.query(sql, [req.query.state, a, b], (err, results) => {
                if (err)
                    return res.cc(err)
                res.send({
                    status: 0,
                    message: '查询成功',
                    data: results,
                    total: total
                })
            })
        })
    } else if (req.query.cate_id !== '' && req.query.state === '') {
        sqltt = 'select * from ev_articles where ev_articles.cate_id =?  and ev_articles.is_delete = 0'
        sql = `select ev_articles.Id ,ev_articles.title,ev_articles.pub_date,ev_article_cate.name,ev_articles.state from ev_articles,ev_article_cate where ev_articles.cate_id=ev_article_cate.Id and ev_articles.cate_id =?  and ev_articles.is_delete = 0 LIMIT ?,?`
        db.query(sqltt, [req.query.cate_id], (err, results) => {
            if (err)
                return res.cc(err)
            total = results.length

            db.query(sql, [req.query.cate_id, a, b], (err, results) => {
                if (err)
                    return res.cc(err)
                res.send({
                    status: 0,
                    message: '查询成功',
                    data: results,
                    total: total
                })
            })
        })


    } else if (req.query.cate_id !== '' && req.query.state !== '') {
        sqltt = 'select * from ev_articles where ev_articles.cate_id =?  and ev_articles.state =?  and ev_articles.is_delete = 0'
        sql = `select ev_articles.Id ,ev_articles.title,ev_articles.pub_date,ev_article_cate.name,ev_articles.state from ev_articles,ev_article_cate where ev_articles.cate_id=ev_article_cate.Id and ev_articles.cate_id =? and ev_articles.state =?  and ev_articles.is_delete = 0 LIMIT ?,?`
        db.query(sqltt, [req.query.cate_id, req.query.state], (err, results) => {
            if (err)
                return res.cc(err)
            total = results.length
                // console.log(req.query);
            db.query(sql, [req.query.cate_id, req.query.state, a, b], (err, results) => {
                if (err)
                    return res.cc(err)
                res.send({
                    status: 0,
                    message: '查询成功',
                    data: results,
                    total: total
                })
            })
        })
    } else return res.cc('查询失败')
}

//删除文章
module.exports.deleteAtr = (req, res) => {
    const sql = `update ev_articles set is_delete =1 where Id = ?`
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('删除文章失败')
        res.cc('删除文章成功', 0)
    })
}

//获取文章详情
module.exports.artDetail = (req, res) => {
    const sql = `select * from ev_articles where Id = ?`
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取文章失败')
        res.send({
            status: 1,
            message: '获取文章失败',
            data: results[0]
        })
    })
}