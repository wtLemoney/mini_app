// pages/detail/detail.js
const config = require('../../config.js')

const qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct(options.id);
  },
  getProduct(id) {
    wx.showLoading({
      "title": "商品数据加载中..." // 在载入时显示的载入文字
    })

    qcloud.request({
      url: config.service.productDetail + id, //或者  config.service.productDetail
      
      success: result => {
        wx.hideLoading();
        console.log(result.data);
        if (!result.data.code) {
          this.setData({
            product: result.data.data
          })
        } else {
          setTimeout(()=>{
            wx.navigateBack() //回退到上个页面
          },2000)
        }

      },
      fail: result => {
        wx.hideLoading();
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
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