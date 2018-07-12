const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM product;")
  },
  detail: async ctx => {
    let productID = + ctx.params.id;
    let product;

    if(!isNaN(productID)){
      product = (await DB.query("SELECT * FROM product where product.id = ?", [productID]))[0];//数组只有一项，其为对象
    }else{
      product = {}
    }
    ctx.state.data = product;
  }
}