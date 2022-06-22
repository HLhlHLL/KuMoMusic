import request from '../../utils/request.js'
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取表单数据
  handleInput(e) {
    const type = e.target.id
    const value = e.detail.value
    this.setData({
      [type]: value
    })
  },

  // 登录
  async handleSubmit() {
    const { phone, password } = this.data

    if(phone.trim() === '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      })
      return
    }
    const reg = /(13|14|15|18|17)[0-9]{9}/
    if(!reg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error'
      })
      return
    }

    if(password.trim() === '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return
    } else if(password.length < 6) {
      wx.showToast({
        title: '密码不能小于 6 位',
        icon: 'error'
      })
      return
    }

    // 验证通过，发起请求
    const { code, profile, token, cookie } = await request('/login/cellphone', {
      phone, password
    }, 'POST')
    if(code === 200) {
      // 本地保存用户信息
      wx.setStorageSync('userinfo', JSON.stringify(profile))
      wx.setStorageSync('token', token)
      wx.setStorageSync('cookie', cookie)
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else if(code === 501) {
      wx.showToast({
        title: '手机号错误',
        icon: 'error'
      })
    } else if(code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      })
    }
  },

  // 游客登录
  handleToIndex() {
    wx.switchTab({
      url: '/pages/index/index',
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