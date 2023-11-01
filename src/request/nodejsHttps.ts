/**
 * @file node Http 模块的方法
 */
import https from "node:https";
import querystring from "node:querystring";
import type { IRequestFn, IRequestConfig } from "@tys/common";
import { isNumber, isObject, isString } from "@/utils/assert";

export const request: IRequestFn = <T>(url: string, data: T, config?: IRequestConfig) => {
    return new Promise((resolve, reject) => {
        const isGetMethod = config?.method?.toUpperCase() === 'GET';
        const { host, pathname } = new URL(url);
        const requestOptions: https.RequestOptions = {
            host,
            path: isGetMethod && isObject(data)
                ? `${pathname}?${querystring.stringify(data!)}`
                : pathname,
            method: isGetMethod ? 'GET' : 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
                ...(config?.headers ?? {}),
            }
        }

        const req = https.request(requestOptions, (res) => {
            const resBuffer: Buffer[] = [];
            res.on('data', (data) => {
                resBuffer.push(data);
            });
            res.on('end', () => {
                const resData = resBuffer.length === 1 ? resBuffer[0] : Buffer.concat(resBuffer);
                resolve(resData.toString());
            });
            req.on('aborted', () => {
                res.destroy();
            });
            req.on('error', function handleStreamError(err) {
                if (req.destroyed) return;
                reject(err);
            });
        });
        if (config?.timeout && isNumber(config?.timeout)) {
            req.setTimeout(config.timeout, () => {
                reject('[https]: timeout');
            });
        }

        const requestData = isGetMethod
            ? undefined
            : isString(data)
                ? (data as string)
                : JSON.stringify(data);
        req.end(requestData);
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