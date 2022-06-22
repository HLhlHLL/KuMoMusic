import request from '../../utils/request'
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultKeyword: '',
    hots: [],
    keywords: '',
    allMatch: [],
    clearValue: '',
    historyKeywords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.timer = null
  },

  // 初始化页面数据
  initData() {
    this.getDefaultKeyword()
    this.getHotList()
  },

  // 获取默认关键词
  async getDefaultKeyword() {
    const { data } = await request('/search/default')
    this.setData({
      defaultKeyword: data.realkeyword
    })
  },

  // 获取热搜列表
  async getHotList() {
    const { data } = await request('/search/hot/detail')
    this.setData({
      hots: data
    })
  },

  // 输入关键词
  handleInputKeyword(e) {
    if(this.timer) return
    setTimeout(() => {
      const keywords = e.detail.value.trim()
      this.setData({
        keywords
      })
      this.getSearchResult(keywords)
      this.timer = null
    }, 500);
  },

  // 获取关键词匹配结果
  async getSearchResult(keywords) {
    if(keywords) {
      const { result } = await request('/search/suggest', {
        keywords,
        type: 'mobile'
      })
      this.setData({
        allMatch: result.allMatch || []
      })
    }
  },

  // 搜索
  handleSearch() {
    const { keywords, historyKeywords, defaultKeyword } = this.data
    // 当关键词为空时，使用默认关键词
    if(!keywords.trim()) {
      historyKeywords.push(defaultKeyword)
      this.setData({
        historyKeywords
      })
    } else {
      // 过滤重复关键词
      if(!historyKeywords.includes(keywords.trim())) {
        historyKeywords.push(keywords)
        this.setData({
          historyKeywords
        })
      }
    }
  },

  // 清空搜索框
  hanleClearKeyword() {
    this.setData({
      clearValue: '',
      keywords: '',
      allMatch: []
    })
  },

  // 清空历史记录
  handleClearHistory() {
    wx.showModal({
      content: '确定清空全部历史记录？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if(res.confirm) {
          this.setData({
            historyKeywords: []
          })
        }
      }
    })
  },

  // 点击热搜榜
  handleTapHotList(e) {
    const keyword = e.currentTarget.dataset.hotkeywords
    this.setData({
      keywords: keyword
    })
    this.handleSearch()
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