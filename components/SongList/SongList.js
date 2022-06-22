const appInstance = getApp()
// components/SongList/SongList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHidden: {
      type: Boolean,
      value: true
    }
  },

  lifetimes: {
    attached() {
      const playList = appInstance.globalData.currentPlayList
      // 从全局获取正在播放的歌曲列表
      this.setData({
        playList
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleHiddeSongList() {
      this.triggerEvent('handleHiddeSongList', { value: !this.data.isHidden})
    },
    // 阻止点击列表主体关闭列表
    handlePrevent() {
      return false
    },
    // 切歌
    handleChangeSong(e) {
      console.log(e.currentTarget.dataset.id);
    },
    // 删除歌曲
    handleDeleteSong(e) {
      const id = e.detail.id
      appInstance.globalData.currentPlayList.forEach(item => {
        item.songList = item.songList.filter(_item => _item.id !== id)
      })
      this.setData({
        playList: appInstance.globalData.currentPlayList
      })
    }
  },

  options: {
    addGlobalClass: true
  }
})
