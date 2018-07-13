// pages/user/user.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: null,
    //   userInfo: {
    //     nickName: "优达学城",
    //     avatarUrl: "", // 头像 URL 地址
    //  }, // 虚拟数据
      locationAuthType: app.data.locationAuthType
  },
  onTapAddress() {
    wx.showToast({
        icon: 'none',
        title: '此功能暂未开放'
      })
    },
  
  onTapKf() {
    wx.showToast({
        icon: 'none',
        title: '此功能暂未开放'
      })
   },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.checkSession({
    //   success: ({ userInfo }) => {
    //     this.setData({
    //       userInfo: userInfo
    //     })
    //   },
    //   error: () => { }
    // })
  },

  onTapLogin: function() {
    // qcloud.setLoginUrl(config.service.loginUrl)
    // qcloud.login({
    //   success: result => {
    //     console.log('success')
    //     console.log(result)
    //   },
    //   fail: result => {
    //     console.log('fail')
    //     console.log(result)
    //   }
    // })

      // this.login({
      //   success: ({ userInfo }) => {
      //     this.setData({
      //       userInfo:userInfo
      //     })
      //   }
      // })

    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })


  },
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})