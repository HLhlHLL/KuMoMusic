import request from '../../utils/request'
// pages/allplaylist/allplaylist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allTags: [],
    allPlayList: [],
    curNavIdx: 0,
    curNavId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  initData() {
    this.getAllTags()
  },

  async getAllTags() {
    const { tags } = await request('/playlist/highquality/tags')
    // 首屏数据
    this.getAllList(tags[0].name)
    this.setData({
      allTags: tags.slice(0, 8)
    })
  },

  async getAllList(tag) {
    const { playlists } = await request('/top/playlist/highquality', {
      cat: tag
    })
    this.setData({
      allPlayList: playlists
    })
  },

  // 切换 Tab
  handleTapNav(e) {
    this.setData({
      curNavIdx: e.currentTarget.dataset.index,
      curNavId: e.currentTarget.id
      
    })
    const tag = e.currentTarget.dataset.tag
    this.getAllList(tag)
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