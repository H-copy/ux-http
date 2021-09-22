import { BaseRequest } from './core'


/**
 * 请求器
 * @summary 继承 BaseRequest 基础能力
 * @example
 * const http = new HTTP({ baseUrl: 'http://www.yyds.com', ... })
 * const requestTaskKey = 'yyds'
 * const api = (query) => http.GET('/user', query, { requestTaskKey }) // 封装接口
 * api({id: 'uu1223'}).then(d => console.log(d)) // 发起请求
 * const task = http.takeRequestTask(requestTaskKey) // 获取中断
 * task.abort() // 中断请求
 * 
 * @function GET
 * @function POST 
 * @function PUT
 * @function DELETE 
 */
 export class Request extends BaseRequest {
	constructor(config = {}) {
		super(config, uni.request)
	}
	
	GET(url, query, options){
		return this.request({
			url,
			method: 'GET',
			data: query,
			...options
		})
	}
	
	POST(url, data, options){
		return this.request({
			url,
			method: 'POST',
			data: data,
			...options
		})
	}

	PUT(url, data, options){
		return this.request({
			url,
			method: 'PUT',
			data: data,
			...options
		})
	}

	DELETE(url, data, options){
		return this.request({
			url,
			method: 'DELETE',
			data: data,
			...options
		})
	}
}
