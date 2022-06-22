import { formatCount } from '../../utils/util'
// components/PlayListItem/PlayListItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playListItem: {
      type: Object,
      value: () => ({}),
      observer(newVal) {
        newVal.playCount = formatCount(newVal.playCount)
        this.setData({
          listItem: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listItem: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开歌单列表
    handleOpenPlayList() {
      const id = this.properties.playListItem.id
      wx.navigateTo({
        url: `/pages/playlist/playlist?id=${id}`,
      })
    }
  },

  options: {
    addGlobalClass: true
  }
})
