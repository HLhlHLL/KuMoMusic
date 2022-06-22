// components/PlayList/PlayList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ''
    },
    btnText: {
      type: String,
      value: ''
    },
    listItem: {
      type: Object,
      value: () => ({})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开歌单
    handleOpenPlayList() {
      const id = this.data.listItem.id
      wx.navigateTo({
        url: `/pages/playlist/playlist?id=${id}`
      })
    },
    // 打开歌单详情
    handleOpenPlayListDetail() {
      console.log('catch event');
    }
  },

  options: {
    addGlobalClass: true
  }
})
