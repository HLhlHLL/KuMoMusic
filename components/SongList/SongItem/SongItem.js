const appInstance = getApp()

// components/SongList/SongItem/SongItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    song: {
      type: Object,
      value: () => ({}),
      observer(newVal) {
        const artists = newVal.song?.artists.map(item => item.name).join('、') || newVal.ar.map(item => item.name).join('、')
        this.setData({
          artists
        })
      }
    },
    index: {
      type: Number,
      value: 0
    }
  },

  lifetimes: {
    attached() {
      this.setData({
        currentIndex: appInstance.globalData.currentIndex
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    artists: '',
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切歌
    handleChangeSong() {
      const id = this.properties.song.id
      // 获取当前页面实例
      const currentPages = getCurrentPages()
      const currentPage = currentPages[currentPages.length - 1]
      currentPage.getSongDetail(id)
      currentPage.playMusic(false, id)
      // 更新当前全局播放歌曲 index
      appInstance.globalData.currentIndex = this.properties.index
      // 获取组件实例，排他更新当前全局歌曲 index
      const oSongList = currentPage.selectComponent('.song-list')
      const oSongItems = oSongList.selectAllComponents('.song-item')
      oSongItems.forEach(item => {
        item.setData({
          currentIndex: this.properties.index
        })
      })
    }
  },

  options: {
    addGlobalClass: true
  }
})
