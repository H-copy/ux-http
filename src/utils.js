export const SECOND = 1000
export const DEFAULT_TIMEOUT = SECOND * 60
export function fullUrlCheck(url){
  const re = /^(http:\/\/|https:\/\/)/ig
  return re.test(url)
}

/**
 * Promise队列
 * @summary
 * 将队列内的函数，通过Promise串联执行
 * @params args 一或多条执行函数
 * 
 * @function use 添加单一配置, push的单一参数方法
 * @function push 向队列末尾入队
 * @function unshift 向队列开头入队
 * @function inset 向队列指定位置插入
 * @function remove 移除元素
 * @function queue 获取执行队列
 * @function with 管理某执行函数
 * @function withBefore 关联函数将在列队末尾执行
 * @function withAfter 关联函数将在队列开始时执行
 */
export class PromiseQueue {
	static create(...args){
		return new PromiseQueue(...args)
	}

	static join(queue){
		return (data) => queue.reduce((acc, cb) => {
			const [success, fail] = Array.isArray(cb) ?  cb : [cb]
			return acc.then(success, fail)
		}, Promise.resolve(data))
	}
	
	constructor(...args){
		this._queue = [...args]
	}

  use(cb){
    this.push(cb)
  }
  
	push(...args){
		const _l = [...args]
		if(_l.length){
			this._queue = [...this._queue, ..._l]
		}
		return this
	}

	unshift(...args){
		const _l = [...args]
		if(_l.length){
      this._queue = [..._l, ...this._queue]
		}
		return this
	}

  inset(position, ...args){
    const len = this._queue
    if(Math.abs(position) >= len){
      throw new Error(`插入位置越界${position}`)
    }
    
    if(_l.length){
      this._queue.splice(position, 0, ...args)
    }
  }
	
	remove(cb){
		this._queue = this._queue.filter(i => i === cb)	
		return this	
	}	

	queue(){
		return [...this._queue]
	}

	with(pr, position = 'before'){
		const queue = this.queue()

		if(pr){
			position === 'before' ? queue.push(pr) : queue.unshift(pr)
		}
		return PromiseQueue.join(queue)
	}

	withBefore(pr){
		return this.with(pr)
	}

	withAfter(pr){
		return this.with(pr, 'after')
	}
}
