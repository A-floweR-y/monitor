/**
 * @file SendBeacon 方法
 */
import type { IRequestFn } from "@tys/common";

export const sendBeacon: IRequestFn = <T>(url: string, data: T) => {
    return new Promise<void>((resolve, reject) => {
        const result = navigator.sendBeacon(url, JSON.stringify(data));
        if (result) {
            resolve();
        } else {
            reject('[navigator.sendBeacon]: 请求未能添加到浏览器队列');
        }
    });
}