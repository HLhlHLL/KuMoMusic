import request from '../../utils/request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendPlaylist: [],
    recommendSingleList: [],
    topList: [],
    defaultKeyword: '',
    navList: [
      {
        icon: 'icon-rili',
        title: '每日推荐',
        page: '/pages/daily/daily'
      },
      {
        icon: 'icon-gedan',
        title: '歌单',
        page: '/pages/allplaylist/allplaylist'
      },
      {
        icon: 'icon-paihangbang',
        title: '排行榜',
        page: ''
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  // 初始化页面数据
  async initData() {
    // 获取默认关键词
    const { data } = await request('/search/default')
    this.setData({
      defaultKeyword: data.realkeyword
    })
    // 获取轮播图列表
    const { banners } = await request('/banner')
    this.setData({
      bannerList: banners
    })
    // 获取歌单列表
    const limit = 10
    const { result: playList } = await request('/personalized', { limit })
    this.setData({
      recommendPlaylist: playList
    })
    // 获取单曲列表
    const { result: singleList } = await request('/personalized/newsong', {
      limit: 12
    })
    this.setData({
      recommendSingleList: singleList
    })
    // 获取排行榜列表
    const { list } = await request('/toplist')
    const tempList = list.slice(0, 5)
    // 根据排行榜 id 获取对应歌曲
    const topList = []
    for (let item of tempList) {
      const { playlist } = await request('/playlist/detail', { id: item.id })
      topList.push({
        id: item.id,
        name: playlist.name,
        tracks: playlist.tracks.slice(0, 3)
      })
    }
    this.setData({
      topList
    })
  },

  // 打开搜索页
  handleOpenSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 跳转到导航页面
  handleOpenNav(e) {
    const url = e.currentTarget.dataset.page
    wx.navigateTo({
      url
    })
  },

  // 打开更多歌单
  handleOpenAllPlayList() {
    wx.navigateTo({
      url: '/pages/allplaylist/allplaylist',
    })
  },

  // 播放排行榜中的歌曲
  handlePlayMusic(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/songdetail/songdetail?id=${id}`,
    })
  },
 
  // 打开排行榜
  handleOpenTopList(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/playlist/playlist?id=${id}`,
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
