const appInstance = getApp()
// components/SingleSong/SingleSong.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicInfo: {
      type: Object,
      value: () => ({}),
      observer(newVal) {
        const artists = newVal.ar.map(item => item.name).join('、')
        this.setData({
          artists
        })
      }
    },
    showMV: {
      type: Boolean,
      value: false
    },
    showMore: {
      type: Boolean,
      value: false
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    artists: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleOpenMusic() {
      const mid = this.properties.musicInfo.id
      console.log(mid);
    },
    handlePlayMusic() {
      // 触发更新全局歌曲列表
      this.triggerEvent('handleUpdateSongList')
      // 更新当前全局播放歌曲 index
      appInstance.globalData.currentIndex = this.properties.index
      const mid = this.properties.musicInfo.id
      wx.navigateTo({
        url: `/pages/songdetail/songdetail?id=${mid}`
      })
    },
    handlePlayMV() {
      const mvid = this.properties.musicInfo.mv
      console.log(mvid);
    },
    handleShowMore() {
      const mid = this.properties.musicInfo.id
      console.log(mid);
    }
  },

  options: {
    addGlobalClass: true
  }
})
