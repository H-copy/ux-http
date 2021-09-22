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


## 扩展功能
> 接口在原接口配置的基础上做了部分易用扩展, 新增配置属性基本基本适用独立请求配置使用。


### base api
- takeRequestTask(key) | 取出 task
- interceptors.request.use(callback) | 添加请求拦截
- interceptors.response.use(callback) | 添加响应拦截
- interceptors.error.use(callback) | 添加错误拦截


### base props
- requestTaskKey : string | task缓存标记, 标记后,可通过takeRequestTask获取
- transformRequest : array | 请求拦截队列
- transformResponse : array | 响应拦截队列
- transformError : array | 错误拦截队列
- baseUrl : string | 基础地址
- requestBefore(ctx) ：function | 请求适配器执行前钩子
- requestAfter(task) ：function | 请求适配器执行后钩子


### Request api
- GET(url, query, options) get请求
- POST(url, data, options) post请求
- PUT(url, query, options)
- DELETE(url, query, options)


### UploadFile api
- sumit(files, options) 发起上传


### UploadFile props
- onProgress : function | 上传进度监听
- offProgress : function | 上传进度取消监听


### DownloadFile api
- sumit(fileUrl, options) 发起下载


### DownloadFile props
- onProgress : function | 下载进度监听
- offProgress : function | 下载进度取消监听


## 使用离职
// TODO


## 工具

### 中间件
// TODO

