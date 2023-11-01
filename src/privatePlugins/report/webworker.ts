/**
 * @file WebWorder 插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import type { IUploadFn } from "@tys/dataPool";
import { postMessage } from "@/request/webworker";
import { sendBeacon } from "@/request/sendBeacon";
import { gzip } from "@/utils/tools";
import { uploadLifecycleWrapper } from "@/utils/monitor";
import useDataPool from "@/dataPool/browser";

const plugin: IMonitorPlugin = {
    name: 'webworker-report-plugin',
    install({ options, extend }) {
        const postMessageFn: IUploadFn = (data: Object[]) => postMessage(
            options.url,
            data,
        );
        const sendBeaconFn: IUploadFn = (data: Object[]) => sendBeacon(
            options.url,
            { data: gzip(data) },
        );
        const { upload, uploadOnce } = useDataPool(postMessageFn, sendBeaconFn);
        const uploadFn = uploadLifecycleWrapper(upload);
        const uploadOnceFn = uploadLifecycleWrapper(uploadOnce);
        
        // 对插件暴露方法
        extend('report', {
            upload: uploadFn,
            uploadOnce: uploadOnceFn,
        });
        // 对外暴露方法
        extend('unload', uploadFn);
        extend('unloadOnce', uploadOnceFn);
    }
};

export default plugin;