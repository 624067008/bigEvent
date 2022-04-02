const { allow } = require('joi')
const joi = require('joi')
    // 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(0).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()
    //页码值,每页显示多少条数据
const pagenum = joi.number().integer().min(0).required()
const pagesize = joi.number().integer().min(0).required()
const cate_id1 = joi.any()
const state1 = joi.any()
    //文章id
const id = joi.number().integer().min(1).required()
    // 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    },
}

//获取文章列表数据
exports.get_artlist_schma = {
    query: {
        pagenum,
        pagesize,
        cate_id: cate_id1,
        state: state1
    }
}
exports.delete_art_schma = {
    params: {
        id
    }
}