import { upDateGlobalSongList } from '../../utils/util'
import request from '../../utils/request'
// pages/daily/daily.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailySongs: [],
    cover: '',
    fixed: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDailySongs()
  },

  // 获取每日推荐
  async getDailySongs() {
    const { data } = await request('/recommend/songs')
    this.setData({
      dailySongs: data.dailySongs,
      cover: data.dailySongs[0].al.picUrl
    })
  },

  // 页面滚动到目标距离时将头部固定
  onPageScroll(e) {
    if(e.scrollTop >= 210) {
      this.setData({
        fixed: 'fixed'
      })
    } else {
      this.setData({
        fixed: ''
      })
    }
  },

  // 更新全局当前播放歌曲列表
  handleUpdateSongList() {
    upDateGlobalSongList(this.data.dailySongs)
  },

  // 全部播放
  handlePlayAll() {
    upDateGlobalSongList(this.data.dailySongs)
    const id = this.data.dailySongs[0].id
    wx.navigateTo({
      url: `/pages/songdetail/songdetail?id=${id}`,
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