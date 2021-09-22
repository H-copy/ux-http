import { BaseRequest } from './core'

/**
 * 上传器
 * @summary 继承 BaseRequest 基础能力
 * @param onProgress 上传进度监听
 * @param offProgress 取消进度监听
 */
 export class UploadFile extends BaseRequest{
	constructor(config = {}) {
		const {
			fileUrl,
			onProgress,
			offProgress,
			...other
		} = config

		super({
			baseUrl: fileUrl,
			...other,
		}, uni.uploadFile)

		this.onProgress = onProgress
		this.offProgress = offProgress
	}

	sumit(files, options = {}){
		const _this = this

		if(files && !Array.isArray(files)){
			options = files
		}else{
			options = {
				files,
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
