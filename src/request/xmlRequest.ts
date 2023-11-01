/**
 * @file XMLHttpRequest 方法
 */

import type { IRequestFn, IRequestConfig } from "@tys/common";
import { isNumber, isObject, isString } from "@/utils/assert";

export const request: IRequestFn = <T>(url: string, data: T, config?: IRequestConfig) => {
    return new Promise((resolve, reject) => {
        const defaultHeaders = {
            'Content-Type': 'text/plain;charset=UTF-8',
            ...(config?.headers ?? {}),
        };
        const isGetMethod = config?.method?.toUpperCase() === 'GET';
        const requestUrl = isGetMethod && isObject(data)
            ? Object
                .keys(data as Object)
                .reduce(
                    (url, key) => `${url}${/\?$/.test(url) ? '' : '&'}${key}=${data[key as keyof typeof data]}`,
                    `${url}?`,
                )
            : url;
        const xhr = new XMLHttpRequest();
        xhr.open(config?.method ?? 'POST', requestUrl);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                resolve(xhr.responseText)
            }
        }
        xhr.onabort = () => {
            if (!xhr) {
            return;
            }
    
            reject('[XMLHttpRequest]: Ajax Cancel');
        }
        xhr.onerror = () => {
            reject('[XMLHttpRequest]: Network Error');
        }
        xhr.ontimeout = () => {
            reject('[XMLHttpRequest]: Ajax Timeout')
        }

        if (config?.timeout && isNumber(config?.timeout)) {
            xhr.timeout = config.timeout;
        }
        
        for (const key of Object.keys(defaultHeaders)) {
            xhr.setRequestHeader(key, defaultHeaders[key as keyof typeof defaultHeaders]);
        }

        const requestData = isGetMethod
            ? null
            : isString(data)
                ? (data as string)
                : JSON.stringify(data);
        xhr.send(requestData);
    });
};

export const post: IRequestFn = <T>(url: string, data: T, config?: IRequestConfig) => request(url, data, {
    ...(config ?? {}),
    method: 'POST',
});

export const get: IRequestFn = <T>(url: string, data: T, config?: IRequestConfig) => request(url, data, {
    ...(config ?? {}),
    method: 'GET',
});