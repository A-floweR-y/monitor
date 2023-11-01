/**
 * @file WebWorker 对外暴露的接口
 */
import type { IRequestFn, IRequestConfig } from "@tys/common";
import { s4 } from "@/utils/tools";
// @ts-ignore
import WebWorker from "web-worker:./../webworker/runtime";

const worker = new WebWorker();
// const worker = new Worker("@/webworker/runtime");

export const postMessage: IRequestFn = <T>(url: string, data: T, config?: IRequestConfig) => {
    return new Promise<void>((resolve, reject) => {
        const uid = s4();
        const handler = ({ data: res }: MessageEvent<{isOk: boolean, uid: string, msg: string}>) => {
            if (res.uid !== uid) {
                return;
            }
            if (res.isOk) {
                resolve();
            } else {
                reject(res.msg);
            }
            worker.removeEventListener('message', handler);
        }
        worker.addEventListener('message', handler);
        worker.postMessage({
            url,
            uid,
            data,
        });
    });
};