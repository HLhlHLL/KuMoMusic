import request from '../../utils/request'
import moment from 'moment'

const appInstance = getApp()
// pages/songdetail/songdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songDetail: {},
    isPlay: false,
    playingStyle: '',
    stateStyle: '',
    musicUrl: '',
    hideSongList: true,
    currentTime: '00:00',
    durationTime: '00:00',
    progressWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongDetail(options.id)
    this.getAudioManager()
    // 判断当前页面正在播放音乐是否与后台正在播放音乐为同一首
    if(appInstance.globalData.currentMusic.isPlay && appInstance.globalData.currentMusic.id == options.id) {
      this.setData({
        isPlay: true,
        playingStyle: 'playing',
        stateStyle: 'playing running'
      })
    }
    // 自动播放
    !this.data.isPlay && this.playMusic(this.data.isPlay, options.id)
  },
  
  // 创建音频管理实例
  getAudioManager() {
    this.audioManager = wx.getBackgroundAudioManager()
    this.audioManager.onPlay(() => {
      this.setData({
        isPlay: true,
        playingStyle: 'playing',
        stateStyle: 'playing running'
      })
    })
    this.audioManager.onPause(() => {
      this.setData({
        isPlay: false,
        playingStyle: '',
        stateStyle: 'playing pause'
      })
    })
    this.audioManager.onEnded(() => {
      this.setData({
        isPlay: false,
        playingStyle: '',
        stateStyle: 'playing pause'
      })
      this.switchMusic('next')
    })
    this.audioManager.onStop(() => {
      this.setData({
        isPlay: false,
        playingStyle: '',
        stateStyle: ''
      })
    })
    this.audioManager.onTimeUpdate(() => {
      this.getMusicPlayProgress()
    })
  },

  // 获取当前歌曲播放进度信息
  getMusicPlayProgress() {
    // 当前播放时长
    const currentTime = moment(this.audioManager.currentTime * 1000).format('mm:ss')
    // 进度条长度
    const progressWidth = this.audioManager.currentTime / this.audioManager.duration * 480 + 'rpx'
    this.setData({
      currentTime,
      progressWidth
    })
  },

  // 获取歌曲详情
  async getSongDetail(id) {
    const { songs } = await request('/song/detail', {
      ids: id
    })
    songs[0].artists = songs[0].ar.map(_item => _item.name).join('、')
    const durationTime = moment(songs[0].dt).format('mm:ss')
    this.setData({
      songDetail: songs[0],
      durationTime
    })
  },

  // 点击播放的回调
  handlePlayMusic() {
    this.playMusic(this.data.isPlay, this.data.songDetail.id)
  },

  // 播放、暂停
  async playMusic(isPlay, mid) {
    if(!isPlay) {
      if(mid !== this.data.songDetail.id || !this.data.musicUrl) {
        // 当 mid 发生变化时直接发起新请求，当 mid 没有发生变化且当前有正在播放的歌曲时不发起请求
        // 获取当前音乐 url
        const { data } = await request('/song/url', {
          id: mid
        })
        const musicUrl = data[0].url
        this.setData({
          musicUrl
        })
      }
      // 当设置了 src 属性和 title 属性，音乐会自动播放
      this.audioManager.src = this.data.musicUrl
      this.audioManager.title = this.data.songDetail.name
      this.setData({
        isPlay: true,
        playingStyle: 'playing',
        stateStyle: 'playing running'
      })
      // 更新后台音乐状态
      appInstance.globalData.currentMusic.id = mid
      appInstance.globalData.currentMusic.isPlay = this.data.isPlay
    } else {
      // 暂停
      this.audioManager.pause()
      this.setData({
        isPlay: false,
        playingStyle: '',
        stateStyle: 'playing pause'
      })
      appInstance.globalData.currentMusic.isPlay = this.data.isPlay
    }
  },

  // 切歌
  switchMusic(type) {
    const current = appInstance.globalData.currentPlayList[0].songList.findIndex(item => item.id == this.data.songDetail.id)
    let currentIndex = undefined
    let nextId = undefined
    switch (type) {
      case 'next':
        if(current === appInstance.globalData.currentPlayList[0].length) {
          currentIndex = current
        } else {
          currentIndex = current + 1
        }
        nextId = appInstance.globalData.currentPlayList[0].songList[currentIndex].id
        break
      case 'previous':
        if(current === 0) {
          currentIndex = 0
        } else {
          currentIndex = current - 1
        }
        nextId = appInstance.globalData.currentPlayList[0].songList[currentIndex].id
        break
    
      default:
        break
    }
    // 更新界面
    this.getSongDetail(nextId)
    // 自动播放下一首
    this.playMusic(false, nextId)
    // 更新后台音乐状态
    appInstance.globalData.currentMusic.id = nextId
    appInstance.globalData.currentMusic.isPlay = true
    // 获取当前页面实例
    const currentPages = getCurrentPages()
    const currentPage = currentPages[currentPages.length - 1]
    // 获取组件实例，排他更新当前全局歌曲 index
    const oSongList = currentPage.selectComponent('.song-list')
    const oSongItems = oSongList.selectAllComponents('.song-item')
    oSongItems.forEach(item => {
      item.setData({
        currentIndex
      })
    })
  },

  // 歌曲定位，设置进度条样式
  handleSeekMusic(e) {
    let offset = e.touches[0].clientX - e.currentTarget.offsetLeft
    if(offset <= 0) {
      offset = 0
    } else if(offset >= 240) {
      offset = 240
    }
    this.setData({
      progressWidth: offset + 'px'
    })
    // 手指按下后解绑进度监听
    this.audioManager.onTimeUpdate(() => {})
  },

  // 歌曲定位，设置歌曲播放进度
  handleSeekMusicEnd() {
    // 跳转时间
    const forward = (this.data.songDetail.dt / 1000) * (parseInt(this.data.progressWidth) / 240)
    this.audioManager.seek(forward)
    // 松开手指后重新绑定进度监听
    this.audioManager.onTimeUpdate(() => {
      this.getMusicPlayProgress()
    })
  },

  // 上一首
  handleSwitchPrevious() {
    this.switchMusic('previous')
  },

  // 下一首
  handleswitchNext() {
    this.switchMusic('next')
  },

  // 打开播放列表
  handleOpenSongList() {
    this.setData({
      hideSongList: false
    })
  },

  // 隐藏播放列表
  handleHiddeSongList(e) {
    this.setData({
      hideSongList: e.detail.value
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