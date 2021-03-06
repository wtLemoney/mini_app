/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
//authorizationMiddleWare 和 validationMiddleware帮助我们授权及验证登陆的状态的中间件
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//新加2018.07.11,表示，我们对于结尾是 /product 的 get 请求，我们会使用刚刚定义在 controllers 中的 product 的 list 对应的功能。
router.get('/product',controllers.product.list)

router.get('/product/:id', controllers.product.detail)

// 创建订单
router.post('/order', validationMiddleware, controllers.order.add)
// 显示已购买订单
router.get('/order', validationMiddleware, controllers.order.list)

module.exports = router
