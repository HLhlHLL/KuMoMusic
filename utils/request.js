import { baseUrl, mobileUrl } from './config'

const cookieStr = wx.getStorageSync('cookie')

const cookies = cookieStr.split(';;')
const cookie = cookies.find(item => item.includes('MUSIC_U'))

export default (url, data = {}, method = 'GET') => {
  if(method.toUpperCase() === 'GET') {
    url = baseUrl + url + `?cookie=${cookie}`

    // 当请求方式为 GET 并且 url 中已经携带了query 参数时，data 中的参数需要手动拼接，否则 query 参数会被自动截断
    let qs = ''
    if(data) {
      for(let key in data) {
        qs += `&${key}=${data[key]}`
      }
      data = {}
    }
    url = url + qs
  } else {
    url = baseUrl + url
  }

  if(method.toUpperCase() === 'POST') {
    data.cookie = cookie
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: {
        cookie: cookie ? cookie : ''
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}