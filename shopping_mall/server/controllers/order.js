const DB = require('../utils/db.js') //导入数据库操作代码
  module.exports = {
  /**
   * 创建订单
   * 
   */

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    //在后续写客户端逻辑的时候我们会把要购买的商品列表存放在 list 变量中进行传输，因此这里我们读取了 body 下的 list。
    let productList = ctx.request.body.list || []

    // 插入订单至 order_user 表
    let order = await DB.query('insert into order_user(user) values (?)', [user])

    // 插入订单至 order_product 表
    let orderId = order.insertId //从插入订单用户表返回的数据中获得 orderId
    let sql = 'INSERT INTO order_product (order_id, product_id, count) VALUES '

    // 插入时所需要的数据和参数
    let query = []
    let param = []

    productList.forEach(product => {
      query.push('(?, ?, ?)')

      param.push(orderId)
      param.push(product.id)
      param.push(product.count || 1)

    })

    await DB.query(sql+query.join(', '), param)

    ctx.state.data = {}

  },



  /**
   * 获取已购买订单列表
   * 
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let list = await DB.query('SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id', [user])

    // 将数据库返回的数据组装成页面呈现所需的格式

    let ret = []
    let cacheMap = {}
    let block = []
    let id = 0

    list.forEach(order => {
      if (!cacheMap[order.id]) {
        block = []
        ret.push({
          id: ++id,
          list: block
        })

        cacheMap[order.id] = true
      }

      block.push(order)
    })

    ctx.state.data = ret
  },
}