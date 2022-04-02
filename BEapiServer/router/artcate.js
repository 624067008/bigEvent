const express = require('express')

const router = express.Router()
const artCate_handler = require('../router_handler/artcate')
    //导入数据验证中间件
const expressJoi = require('@escook/express-joi')
    //导入验证规则
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

//获取文章列表
router.get('/cates', artCate_handler.getArtCates)

//增加文章分类
router.post('/addcates', expressJoi(add_cate_schema), artCate_handler.addArticleCates)

//删除文章
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artCate_handler.deleteCateById)

//根据id获取文章分类
router.get('/cates/id', expressJoi(get_cate_schema), artCate_handler.getArtCateById)

//根据id更新文章分类
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handler.updateCateById)

module.exports = router