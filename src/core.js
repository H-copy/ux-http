import {
	fullUrlCheck,
	PromiseQueue
} from './utils'


/**
 * 基础请求包装
 * @summary 提供 Promise 封装, 并缓存中断任务。提供常用请求方法封装
 * 
 * @params config 全局请求配置
 * @params adapter 请求发送接口
 * 
 * @prop config 全局配置
 * @prop requestTaskCache 中断队列
 * @prop interceptors 拦截器
 * 	- request 请求拦截队列
 *  - response 响应拦截队列
 * 	- error 错误拦截队列
 * @prop requestBefore 请求发送前钩子
 * @prop requestAfter 请求发送后钩子
 * 
 * @function request 基础请求
 * @function takeRequestTask 获取中断
 * 
 */
 export class BaseRequest{
	constructor(globalConfig = {}, adapter) {

		const { 
			baseUrl, 
			transformRequest = [],
			transformResponse = [],
			transformError = [],
			..._config
		} = globalConfig
		
		this.baseUrl = baseUrl || ''
		this.config = _config
		this.requestTaskCache = new Map([])
		this.adapter = adapter

		this.interceptors = {
			request: PromiseQueue.create(...transformRequest),
			response: PromiseQueue.create(...transformResponse),
			error: PromiseQueue.create(...transformError),
		}
	}


	// 拼接请求管道
	/**
	 * 将请求相关处理函数按照队列拼接为一条Promise执行链,
	 * 执行流程:
	 * 
	 * 请求拦截 -> [ 请求前置函数, 请求函数, 请求后置函数 ] -> 响应拦截 -> 错误拦截
	 * 
	 * 注意：因为绑定在同一执行链上，错误拦截将获取之前链上的任意
	 */
	request(options){
		const _this = this
		const {
			transformRequest,
			transformResponse,
			transformError,
			..._options
		} = options

		const requestTask = transformRequest || _this.interceptors.request.queue()  
		const responseTask = transformResponse || _this.interceptors.response.queue()  
		const errorTask = transformError || _this.interceptors.error.queue()
		
		const ctx = _this.createCtx(_options)
		const core = opt => _this.core(opt)
		const task = [...requestTask, core, ...responseTask]

		// 拼接任务链
		return this.joinTask(task)(ctx).catch(e => this.joinTask(errorTask)(e))
	}
	
	core(ctx){
		const _this = this
		return new Promise((res, rej) => {
			const { 
				url, 
				success, 
				fail, 
				complete, 
				requestTaskKey,
				requestBefore,
				requestAfter,
				..._options
			} = ctx

			const setting = {
				..._options,
				url: _this.urlJoin(url),
				success(d){
					res(success ? success(d) : d)
				},
				fail(e){
					rej(fail ? fail(e) : e)
				},
				complete(){
					complete && complete()
					// 清理中断
					requestTaskKey && _this.requestTaskCache.delete(requestTaskKey)
				}
			}
			
			/**
			 * 1. 将请求包装为Promise
			 * 2. 收集中断对象
			 * 3. 请求完成或取出中断时, 清理中断缓存
			 * 4. 保持配置回调的请求方式
			 * 5. 调用周期钩子
			 */
			requestBefore && requestBefore({...setting})
			const requestTask = this.adapter(setting)
			requestAfter && requestAfter(requestTask)
			if(requestTaskKey){
				_this.requestTaskCache.set(requestTaskKey, requestTask)
			}
		})
	}

	// 混合全局配置
	createCtx(requestOptions){
		return { 
			...this.config, 
			...requestOptions,
		}
	}

	// 拼接拦截器
	joinTask(queue){
		return (data) => queue.reduce((acc, cb) => {
			const [success, fail] = Array.isArray(cb) ?  cb : [cb]
			return acc.then(success, fail)
		}, Promise.resolve(data))
	}

	urlJoin(url){
		if(fullUrlCheck(url)){
			return url
		}
		return `${this.baseUrl}${url}`
	}

	// 取出中断
	takeRequestTask(key){
		if(!this.requestTaskCache.has(key)){
			return null
		}
		
		const task = this.requestTaskCache.get(key)
		this.requestTaskCache.delete(key)
		return task
	}
}
