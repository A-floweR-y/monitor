/**
 * @file WebWorker 运行时。
 * 备注：rollup-plugin-web-worker-loader 插件目前只支持 js 和 rollup2
 */
import { post } from "@/request/xmlRequest";
import { gzip } from "@/utils/tools";

export const bind  = (global) => {
    global.onmessage = ({ data: { uid, url, data } }) => {
        post(url, { data: gzip(data) })
            .then(() => global.postMessage({ uid, isOk: true }))
            .catch((msg) => global.postMessage({ uid, msg, isOk: false }));
    }
}
bind(self);