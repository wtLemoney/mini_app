module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {// 在验证登陆状态成功的情况下，我们会将登陆的数据返回给用户。
        // loginState 为 1，登录态校验成功
        ctx.state.data = ctx.state.$wxInfo.userinfo
    } else {
        ctx.state.code = -1
    }
}
