const appInstance = getApp()
// 更新全局的当前播放列表
const upDateGlobalSongList = (dataList) => {
  const len = appInstance.globalData.currentPlayList.length
  // 歌曲来源标识
  const unique = dataList.reduce((pre, cur) => pre += cur.id, '')
  let isSame = false
  // 判断来源是否相同
  if(len > 0) {
    isSame = appInstance.globalData.currentPlayList[0].unique === unique
  }
  // 最大长度为3
  if(!isSame) {
    if(len < 3) {
      appInstance.globalData.currentPlayList.unshift({
        count: dataList.length,
        unique,
        songList: dataList.slice(0)
      })
    } else {
      appInstance.globalData.currentPlayList.pop()
      appInstance.globalData.currentPlayList.unshift({
        count: dataList.length,
        unique,
        songList: dataList.slice(0)
      })
    }
    const title = ''
    switch (len) {
      case 0:
        appInstance.globalData.currentPlayList[0].title = '当前播放'
        break
      case 1:
        appInstance.globalData.currentPlayList[0].title = '当前播放'
        appInstance.globalData.currentPlayList[1].title = '上次播放'
        break
      case 2:
        appInstance.globalData.currentPlayList[0].title = '当前播放'
        appInstance.globalData.currentPlayList[1].title = '上次播放'
        appInstance.globalData.currentPlayList[2].title = '历史播放'
        break
    
      default:
        break
    }
    
  }
}

// 格式化 count
const formatCount = (count) => {
  const len = count.toString().length
  if(len <= 4) {
    return count + ''
  }
  if(len > 4 && len <= 8) {
    return Math.round(count / 10000) + '万'
  }
  if(len > 8 && len <= 11) {
    return Math.round(count / 10000000) + '亿'
  }
}


export {
  upDateGlobalSongList,
  formatCount
}
