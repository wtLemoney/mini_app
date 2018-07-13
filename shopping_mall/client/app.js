//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2


App({
  onLaunch: function () {
      qcloud.setLoginUrl(config.service.loginUrl)
  },

  data: {
    locationAuthType: UNPROMPTED
  },

  getUserInfo({ success, error }) {// 发送请求，返回数据
    if (userInfo) {
      return userInfo;
    } else {
      qcloud.request({
        url: config.service.requestUrl,
        login: true,//发送请求的时候会带上用户身份相关的信息
        success: result => {
          let data = result.data
          // console.log(data);
          if (!data.code) {
            let userInfo = data.data

            success && success({
              userInfo
            })
          } else {
            error && error()
          }
        },
        fail: () => {
          error && error()
        }
      })
    }
  },
  doQcloudLogin({ success, error }) {
    // 调用 qcloud 登陆接口
    qcloud.login({
      success: result => {
        if (result) {
          let userInfo = result
          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail: () => {
        error && error()
      }
    })
  },
  checkSession({ success, error }) {// 执行会话检查
    if (userInfo) {
      success({
        userInfo
      })
    } else {
      wx.checkSession({
        success: () => {
          this.getUserInfo({ success, error })
        },
        fail: () => {
          error && error()
        }
      })
    }

  },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
          // this.setData({
          //   locationAuthType: UNAUTHORIZED
          // })
          this.data.locationAuthType = UNAUTHORIZED
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: true,
            success: () => {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo'] === true) {
                    this.doQcloudLogin({ success, error });
                  }
                }
              })
            }
          })
        } else {
          this.data.locationAuthType = AUTHORIZED
          this.doQcloudLogin({ success, error })
        }
      }
    })
  },
})