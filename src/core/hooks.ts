/**
 * @file hooks 文件
 */

import { IHooksMenu, ISyncHook, ISyncWaterfallHook, IUnHook } from "@tys/hooks";

/**
 * 基础钩子
 */
class Hook {
	protected eventPool: Map<string, Set<Function>>

	constructor() {
		// 事件池
		this.eventPool = new Map();
	}

	on(eventName: string, handler: Function) {
		const handlerList = this.eventPool.get(eventName);

		if (typeof handlerList !== 'undefined') {
			handlerList.add(handler);
		} else {
			// TODO: 需要处理 和变量重复
			const handlerList: Set<Function> = new Set();
			this.eventPool.set(eventName, handlerList);
			handlerList.add(handler);
		}

		const unHook: IUnHook = () => this.off(eventName, handler);
		return unHook;
	}

	off(eventName: string, handler?: Function) {
		const handlerList = this.eventPool.get(eventName);

		if (typeof handlerList === 'undefined') {
			return;
		}

		if (typeof handler === 'undefined') {
			this.eventPool.delete(eventName);
			return;
		}

		if (handlerList.has(handler)) {
			handlerList.delete(handler);
			// 没有事件了，移除 handlerList
			if (handlerList.size === 0) {
				this.eventPool.delete(eventName);
			}
		}
	}
}

/**
* 同步并行钩子
*/
class SyncHook extends Hook implements ISyncHook {
	once<T>(eventName: string, handler: Function) {
		const unHook: IUnHook = this.on(eventName, (data: T) => {
			handler(data);
			unHook();
		});
		return unHook;
	}

	emit<T>(eventName: string, data: T) {
		const handlerList = this.eventPool.get(eventName);

		if (typeof handlerList !== 'undefined') {
			handlerList.forEach((handler) => handler(data));
		}
	}
}

/**
* 同步串行钩子
*/
class SyncWaterfall extends SyncHook implements ISyncWaterfallHook {
	once<T>(eventName: string, handler: Function) {
		const unHook: IUnHook = this.on(eventName, (data: T) => {
			const result = handler(data);
			unHook();
			return result;
		});
		return unHook;
	}

	emit<T>(eventName: string, data: T) {
		const handlerList = this.eventPool.get(eventName);

		if (typeof handlerList === 'undefined') {
			return data;
		}

		let result = data;
		for (const handler of handlerList) {
			result = handler(result);
		}
		return result;
	}
}

// 生成 hooks
export const useHooks = (): IHooksMenu => {
	return {
		syncHook: new SyncHook(),
		syncWaterfall: new SyncWaterfall(),
	};
}

// 单例 hooks
export const singleHooks = useHooks();