 // pages/home/home.js
const config = require('../../config.js')

const qcloud = require('../../vendor/wafer2-client-sdk/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: []// 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList();
    console.log(config.service.productList)
  },
  getProductList() {
    wx.showLoading({
      "title":"商品数据加载中..." // 在载入时显示的载入文字
    })
    qcloud.request({
      url: 'https://qpq8syzq.qcloud.la/weapp/product', //或者  config.service.productList
      success: result => {
        wx.hideLoading();
        console.log(result.data);
        if(!result.data.code) {
          this.setData({
            productList: result.data.data
          })
        }else {
          wx.showToast({
            title: "商品数据加载失败"
          })
        }
        
      },
      fail: result => {
        wx.hideLoading();
        wx.showToast({
          title:"数据加载失败"
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