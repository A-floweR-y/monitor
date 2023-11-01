/**
 * @file XMLHttpRequest 插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import type { IUploadFn } from "@tys/dataPool";
import { post } from "@root/src/request/nodejsHttps.js";
import { gzip } from "@/utils/tools";
import { uploadLifecycleWrapper } from "@/utils/monitor";
import useDataPool from "@/dataPool/nodejs";

const plugin: IMonitorPlugin = {
    name: 'nodejs-report-plugin',
    install({ options, extend }) {
        const postFn: IUploadFn = (data: Object[]) => post(
            options.url,
            { data: gzip(data) },
        );;
        const { upload, uploadOnce } = useDataPool(postFn);
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