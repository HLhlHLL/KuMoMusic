import request from '../../utils/request'
// pages/userinfo/userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    favoritelist: [],
    createlist: [],
    collectlist: [],
    userlevel: {},
    fixed: '',
    curManageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  // 初始化页面数据
  async initData() {
    const userinfo = wx.getStorageSync('userinfo')
    if(userinfo) {
      this.setData({
        userinfo: JSON.parse(userinfo)
      })
      // 获取用户等级信息
      const { data } = await request('/user/level')
      this.setData({
        userlevel: data
      })
      // 获取用户歌单
      const uid = this.data.userinfo.userId
      const { playlist} = await request('/user/playlist', { uid })
      const favoritelist = playlist.filter(item => item.specialType === 5)
      const createlist = playlist.filter(item => item.creator.userId === uid && item.specialType !== 5)
      const collectlist = playlist.filter(item => item.creator.userId !== uid)
      this.setData({
        favoritelist,
        createlist,
        collectlist
      })
    }
  },

  // 跳转到登录页面
  handleToLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  onPageScroll(e) {
    if(e.scrollTop > 345) {
      this.setData({
        fixed: 'fixed'
      })
    } else {
      this.setData({
        fixed: ''
      })
    }
  },

  // 切换歌单
  handleToggleManage(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      curManageIndex: index
    })

    if(index === 0) {
      wx.pageScrollTo({
        duration: 500,
        scrollTop: 365
      })
    } else {
      wx.pageScrollTo({
        duration: 500,
        scrollTop: 878
      })
    }
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