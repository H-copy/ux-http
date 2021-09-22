# ux-http

> 这是个对 uniapp 请求API( uni.request, uni.uploadFile, uni.downloadFile ) 的二次封装，提供简便的常用接口，例如：GET, POST。 接口设计倾向与易用且独立。

## 主要功能
- 提供 task 队列
- 提供 Promise 调用方式，可获取 task
- 提供 请求，响应, 错误处理，前置拦截器
- 提供 全局配置与独立请求配置
- 普通请求，文件上传, 文件下载彼此独立
- 可替换自定义请求函数

## 主要模块
- Request  http请求模块
- UploadFile 文件上传
- DownloadFile 文件下载
- HTTP 三模块的组合体


## 简单例子
```javascript
import { HTTP } from 'ux-http'

const http = new HTTP({
  baseUrl: '....',
  // 请求拦截
  transformRequest: [
    (req) => {
      console.log('req')
      return req
    }
  ],
  // 响应拦截
  transformResponse: [
    (res) => {
      console.log('res')
      return res
    }
  ]
})

http.get(
  '/...', // 请求地址
  {id: 11},  // 查询参数
  { requestTaskKey: 'getUser' } // 设置 task 获取key
).then(d => { ... })

// 取消请求
http.takeRequestTask('getUser').abort()

```


## API
