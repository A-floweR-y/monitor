/**
 * @file 公共数据拼装插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import { isBoolean, isObject } from "@/utils/assert";
import { guid } from "@/utils/tools";

const plugin: IMonitorPlugin = {
    name: 'data-lego-plugin',
    install({ options, hooks }) {
        hooks.beforeUpload((data: Object) => {
            const uploadData = {
                ...data,
                flag: 'y.yang-test8',
                uuid: guid(),
                ts: Date.now(),
            };

            // debug 模式
            if ((isBoolean(options.debug) && options.debug) || isObject(options.debug)) {
                console.log('Monitor[Debug] --> ', uploadData);
            }

            return uploadData;
        });
    }
};

export default plugin;