import request from '../../utils/request'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    curNavId: 0,
    curNavIdx: [],
    videoList: [],
    showVideo: false,
    idCacheList: [],
    offset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNavList()
  },

  // 获取导航列表
  async getNavList() {
    const { data } = await request('/video/category/list')
    this.setData({
      navList: data
    })
    this.setData({
      curNavId: this.data.navList[0].id
    })
    // 保存已经加载的列表 id
    this.data.idCacheList.push(this.data.navList[0].id)
  },

  // 切换导航
  handleTapNav(e) {
    const id = e.currentTarget.dataset.id
    const idx = e.currentTarget.dataset.index
    this.setData({
      curNavIdx: idx,
      curNavId: id
    })
  },

  // 切换视频列表
  async handelSwiperItemChange(e) {
    const idx = e.detail.current
    const curVideoListId = this.data.navList[idx].id
    this.setData({
      curNavId: curVideoListId
    })

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    // 获取子组件实例列表，通过实例实现动态加载列表数据
    const oVideoLists = this.selectAllComponents('.video-list')
    const { id } = await oVideoLists[idx].getVideoListData(curVideoListId)

    // 当列表未加载时显示加载动画
    if(!this.data.idCacheList.includes(id)) {
      // 保存已经加载的视频列表 id
      this.data.idCacheList.push(id)
    }
  },

  // 当子组件渲染完毕触发该函数
  handleCompReady(e) {
    const idx = e.detail.idx
    const curVideoListId = this.data.navList[idx].id
    // 获取子组件实例，通过实例实现动态加载列表数据
    const oVideoList = this.selectComponent('.video-list')
    oVideoList.getVideoListData(curVideoListId)
  },

  // 点击视频，并获取视频地址列表
  handleOpenVideo(e) {
    const videoList = e.detail
    this.setData({
      videoList,
      showVideo: !this.data.showVideo
    })
  },
  
  // 滑动视频
  async handleVideoChange(e) {
    const { activeId } = e.detail
    const last = this.data.videoList[this.data.videoList.length - 1]
    // 当前为最后一项，追加数据
    if(activeId === last.id) {
      const videoUrlList = await this.getRecommendVideoList(this.data.offset)
      this.setData({
        videoList: videoUrlList,
        offset: this.data.offset + 1
      })
    }
  },

  // 获取推荐视频
  async getRecommendVideoList(offset) {
    const videoUrlList = []
    const { datas } = await request('/video/timeline/recommend', { offset })
    for (let item of datas) {
      const recommendVid = item.data.vid
      const { urls } = await request('/video/url', {id: recommendVid})
      videoUrlList.push({
        id: recommendVid,
        url: urls[0].url,
        objectFit: 'contain'
      })
    }
    return videoUrlList
  },

  // 关闭视频，并清空视频列表
  handleCloseVideo() {
    this.setData({
      showVideo: false,
      videoList: []
    })
    wx.showTabBar()
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