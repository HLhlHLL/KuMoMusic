// app.js
App({
  onLaunch() {
    
  },
  globalData: {
    // 当前正在播放的歌曲
    currentMusic: {
      id: 0,
      isPlay: false
    },
    // 当前歌曲所在的播放列表
    currentPlayList: [],
    currentIndex: 0
  }
})
