const express = require('express')
const router = express.Router()
const router_handler = require('../router_handler/article')
    // 导入解析 formdata 格式表单数据的包
const multer = require('multer')
    // 导入处理路径的核心模块
const path = require('path')
    // 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
    // 导入文章的验证模块
const { add_article_schema, get_artlist_schma, delete_art_schma } = require('../schema/article')
    // 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })
    //增加文章
    // upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
    // 将文件类型的数据，解析并挂载到 req.file 属性中
    // 将文本类型的数据，解析并挂载到 req.body 属性中
    // 发布文章
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), router_handler.addArticle)
    // 获取文章列表
router.get('/list', expressJoi(get_artlist_schma), router_handler.getArtlist)
    // 删除文章
router.get('/delete/:id', expressJoi(delete_art_schma), router_handler.deleteAtr)

//获取文章详情
router.get('/:id', expressJoi(delete_art_schma), router_handler.artDetail)
module.exports = router