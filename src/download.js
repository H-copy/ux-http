import { BaseRequest } from './core'


/**
 * 下载器
 * @summary 继承 BaseRequest 基础能力
 * @param onProgress 下载进度监听
 * @param offProgress 取消进度监听
 */
 export class DownloadFile extends BaseRequest{
	constructor(config = {}) {
		const {
			onProgress,
			offProgress,
			...other
		} = config

		super(other, uni.downloadFile)

		this.onProgress = onProgress
		this.offProgress = offProgress
	}

	/**
	 * 发起下载
	 * @param filePath 文件下载地址 
	 * @param options 自定义配置 
	 * @returns Promise
	 */
	sumit(filePath, options = {}){
		const _this = this

		if(!filePath){
			options = {}
		}else if(filePath && typeof filePath !== 'string'){
			options = files
		}else{
			options = {
				url: filePath,
				...options
			}
		}

		const {
			// 独立配置的回调函数优先级高于全局配置
			requestAfter = _this.config.requestAfter,
			onProgress = _this.onProgress,
			offProgress = _this.offProgress,
			...other
		} = options

		
		// 绑定进度监听
		const ctx = {
			requestAfter(task){
				onProgress && task.onProgressUpdate(onProgress)
				offProgress && task.offProgressUpdate(offProgress)
				requestAfter && requestAfter(task)
			},
			...other
		}
		
		return _this.request(ctx)
	}

}
