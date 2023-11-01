/**
 * @file XMLHttpRequest 插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import type { IUploadFn } from "@tys/dataPool";
import { post } from "@/request/xmlRequest";
import { sendBeacon } from "@/request/sendBeacon";
import { gzip } from "@/utils/tools";
import { uploadLifecycleWrapper } from "@/utils/monitor";
import useDataPool from "@/dataPool/browser";

const plugin: IMonitorPlugin = {
    name: 'browser-report-plugin',
    install({ options, extend }) {
        const postFn: IUploadFn = (data: Object[]) => {
            console.log(data);
            return post(
                options.url,
                { data: gzip(data) },
            )
        };
        const sendBeaconFn: IUploadFn = (data: Object[]) => sendBeacon(
            options.url,
            { data: gzip(data) },
        );
        const { upload, uploadOnce } = useDataPool(postFn, sendBeaconFn);
        const uploadFn = uploadLifecycleWrapper(upload);
        const unloadOnceFn = uploadLifecycleWrapper(uploadOnce);

        // 给插件提供方法
        extend('report', {
            upload: uploadFn,
            uploadOnce: unloadOnceFn,
        });
        // 对外暴露方法
        extend('upload', uploadFn);
        extend('uploadOnce', unloadOnceFn);
    }
};

export default plugin;