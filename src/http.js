import { Request } from './request'
import { UploadFile } from './upload'
import { DownloadFile } from './download'

/**
 * 合并请求，上传，下载
 * @summary 
 * 继承 Request 请求器，通过内置 UploadFile， DownLoadFile
 * 扩展上传，下载功能
 * 
 * @function createUploadFile 创建上传器
 * @function createDownloadFile 创建下载器
 * @function upload 上传
 * @function download 下载
 */
 export class HTTP extends Request {

	constructor(config){
		super(config)
		this.uploadFile = null
		this.downLoadFile = null
	}
	
	createUploadFile(config){
		this.uploadFile = new UploadFile(config)
	}

	createDownloadFile(config){
		this.downLoadFile = new DownloadFile(config)
	}

	upload(config){
		if(!this.uploadFile){
			throw Error('未找到上传器, 请使用createUploadFile创建上传器')
		}
		return this.uploadFile.sumit(config)
	}

	download(config){
		if(!this.downLoadFile){
			throw Error('未找到下载器, 请使用createDownloadFile创建下载器')
		}
		return this.downLoadFile.sumit(config)
	}

}


const http = new HTTP({
	baseUrl: 'https://api.zcool.com.cn'
})

http.createUploadFile({
	fileUrl: 'https://huaban.com/upload/',
	transformRequest: [
		(d) => {
			console.log('http upload request 01')
			return d
		},
		(d) => {
			console.log('http upload request 02')
			return d
		}
	],
	transformResponse: [
		(d) => {
			console.log('http upload response 01')
			return d
		},
		(d) => {
			console.log('http upload response 02')
			return d
		}
	],
	onProgress(){
		console.log('http upload progress')
	}
})