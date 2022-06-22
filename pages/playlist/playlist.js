import request from '../../utils/request'
import { upDateGlobalSongList } from '../../utils/util'
// pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList: [],
    playListDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options.id)
    this.timer = null
  },

  // 初始化页面数据
  initData(id) {
    this.getPlayListData(id)
    this.getPlayListDetail(id)
  },

  // 获取歌单数据
  async getPlayListData(id) {
    const { songs } = await request('/playlist/track/all', {
      id
    })
    this.setData({
      songList: songs
    })
  },

  // 获取歌单详情
  async getPlayListDetail(id) {
    const {playlist} = await request('/playlist/detail', {
      id
    })
    this.setData({
      playListDetail: playlist
    })
  },

  // 更新全局当前播放歌曲列表
  handleUpdateSongList() {
    upDateGlobalSongList(this.data.songList)
  },

  // 全部播放
  handlePlayAll() {
    upDateGlobalSongList(this.data.songList)
    const id = this.data.songList[0].id
    wx.navigateTo({
      url: `/pages/songdetail/songdetail?id=${id}`,
    })
  },

  onPageScroll(e) {
    if(this.timer) return
    this.timer = setTimeout(() => {
      if(e.scrollTop >= 210) {
        this.setData({
          fixed: 'fixed'
        })
      } else {
        this.setData({
          fixed: ''
        })
      }
      this.timer = null
    }, 100);
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