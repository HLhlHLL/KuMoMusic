import { upDateGlobalSongList } from '../../../utils/util'
// pages/index/RecommendSingle/RecommendSingle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendSingleList: {
      type: Array,
      value: () => [],
      observer(newVal) {
        const list = []
        // 将单曲列表转换为二维数据
        let step = 0
        while(step <= newVal.length - 3) {
          list.push(newVal.slice(step, step + 3))
          step += 3
        }
        this.setData({
          list
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 更新全局正在播放的歌单列表数据
    handleUpdateSongList() {
      upDateGlobalSongList(this.properties.recommendSingleList)
    }
  },

  options: {
    addGlobalClass: true
  }
})
