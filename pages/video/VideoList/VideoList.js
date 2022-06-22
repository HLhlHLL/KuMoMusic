import request from '../../../utils/request'
// pages/video/VideoList/VideoList.js
Component({
  // 组件声明周期
  lifetimes: {
    ready() { 
      if(this.properties.index === 0) {
        this.triggerEvent('isReady', {idx: this.properties.index})
      }
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    index: Number,
    videoListId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoInfoList: [],
    isRefreshing: true,
    offset: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取初始化列表数据
    async initVideoListData(id, offset = 0) {
      const { datas } = await request('/video/group', {
        id,
        offset
      })
      datas.forEach(item => {
        item.stamp = Date.now() + Math.floor(Math.random() * 1000)
        const rest = item.data.praisedCount ? (item.data.praisedCount / 1000) : (item.data.likeCount / 1000)
        if(rest < 1) {
          item.data.thumbup = item.data.praisedCount || item.data.likeCount
        }
        else if(rest >= 1 && rest < 10) {
          item.data.thumbup = rest.toFixed(1) + 'k'
        } else if(rest >= 10) {
          item.data.thumbup = (rest / 10).toFixed(1) + 'w'
        }
      })
      return datas
    },

    // 获取视频列表数据
    async getVideoListData(id, offset = 0) {
      // 获取初始数据
      if(this.data.videoInfoList.length === 0) {
        const datas = await this.initVideoListData(id)
        this.setData({
          videoInfoList: datas
        })
      }
      // 获取追加数据
      if(this.data.videoInfoList.length > 0 && offset > 0) {
        const datas = await this.initVideoListData(id, offset)
        this.setData({
          videoInfoList: [...this.data.videoInfoList, ...datas]
        })
      }

      // 关闭加载框
      wx.hideLoading()
      // 关闭下拉刷新样式
      this.setData({
        isRefreshing: false
      })
      return {
        id
      }
    },
    
    // 打开视频
    async handleOpenVideo(e) {
      const vid = e.currentTarget.dataset.vid
      // 获取当前视频地址
      const { urls } = await request('/video/url', {id: vid})
      const videoUrlList = [{
        id: vid,
        url: urls[0].url,
        objectFit: 'contain'
      }]
      // 获取相关视频地址
      const { data } = await request('/related/allvideo', { id: vid })
      for (let item of data) {
        const relatedVid = item.vid
        const { urls } = await request('/video/url', {id: relatedVid})
        videoUrlList.push({
          id: relatedVid,
          url: urls[0].url,
          objectFit: 'contain'
        })
      }

      videoUrlList.unshift(videoUrlList.pop())
      this.triggerEvent('handleOpenVideo', videoUrlList)
      // 隐藏 tabBar
      wx.hideTabBar()
    },

    
    // 下拉刷新
    handleRefresherRefresh() {
      this.setData({
        videoInfoList: [],
        offset: 0
      })
      this.getVideoListData(this.properties.videoListId)
    },

    // 上拉加载
    handleScrollToLower() {
      this.setData({
        offset: this.data.offset + 1
      })
      this.getVideoListData(this.properties.videoListId, this.data.offset)
    }
  },

  options: {
    addGlobalClass: true
  }
})
