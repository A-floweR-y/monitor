import { isMobile } from "@/utils/assert";
// @ts-ignore
import { gzip as pakoGzip } from 'pako/lib/deflate';

// 空函数
export const NOOP = () => { };

// 使用 window.onload
export const usePageOnload = (handler: Function) => {
	if (document.readyState === 'complete') {
		handler();
		return;
	}
	const eventName = 'load';
	const removeEventListener = () => window.removeEventListener(eventName, onceCallback, false);
	window.addEventListener(eventName, onceCallback, false)
	function onceCallback() {
		handler()
		removeEventListener()
	}
	return removeEventListener;
};

// 使用 window.beforeUnload
export const usePageBeforeUnload = (handler: Function) => {
	const callback = () => handler()
	if (isMobile()) {
		// 移动端监听 beforeUpload 不靠谱，因为现代浏览器的 bfcache 会导致与 beforeunload、unload 不兼容
		window.addEventListener('pagehide', callback, false)
	} else {
		window.addEventListener('beforeunload', callback, false)
	}
	const removeEventListener = () => {
		if (isMobile()) {
			window.removeEventListener('pagehide', callback)
		} else {
			window.removeEventListener('beforeunload', callback)
		}
	}
	return removeEventListener
};

// Gzip 压缩
export const gzip = (data: string | any, option = {}) => {
	let inputData = data
	if (typeof data !== 'string') {
		inputData = JSON.stringify(data)
	}
	const encoder = new TextEncoder()
	const encodeData = encoder.encode(inputData)
	const gzipData = pakoGzip(encodeData, { to: 'string', ...option })
	return btoa(gzipData)
}

// 获得4位随机字符串
export const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

// 生成 Guid
export const guid = () => `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;