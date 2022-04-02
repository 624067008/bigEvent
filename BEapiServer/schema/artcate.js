//定义验证规则模块
const joi = require('joi')

//定义文章分类别名验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

//定义文章id验证规则
const id = joi.number().integer().min(1).required()
    // 增加分类规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

//删除分类验证验证规则对象
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 根据id获取分类验证规则对象
exports.get_cate_schema = {
    params: {
        id
    }
}

// 根据id更新分类验证规则对象
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}