/**
 * @file Monitor 工具
 */
import type { IMonitorPlugin } from "@tys/plugin";
import type { IMonitorHooks, IUnExtend } from "@tys/monitor";
import type { IHooksMenu } from "@tys/hooks";
import { MonitorHooks } from "@/enum/common";
import { singleHooks } from "@/core/hooks";

// 加载远程插件
export const loadPlugin = (url: string) => import(url).then((res) => (res.default as IMonitorPlugin));

// 装载对外的 hooks
export const useHooks = (hooks: IHooksMenu): IMonitorHooks => {
    return {
        init: (handler: Function) => hooks.syncHook.once(
            MonitorHooks.INIT,
            handler,
        ),
        beforeUpload: (handler: Function) => hooks.syncWaterfall.on(
            MonitorHooks.BEFORE_UPLOAD,
            handler,
        ),
        afterUpload: (handler: Function) => hooks.syncHook.on(
            MonitorHooks.AFTER_UPLOAD,
            handler,
        ),
        uninstall: (handler: Function) => hooks.syncHook.once(MonitorHooks.UNINSTALL, handler)
    }
};

// 包装beforeUpload 和 afterUpload 声明周期
export const uploadLifecycleWrapper = (upload: Function) => {
    return (data: Object) => {
        const uploadData = singleHooks.syncWaterfall.emit(MonitorHooks.BEFORE_UPLOAD, data);
        upload(uploadData);
        singleHooks.syncHook.emit(MonitorHooks.AFTER_UPLOAD, uploadData);
    }
};

// 合并扩展内容
export const mergeExtends = (target: Object, contents: Object): IUnExtend => {
    let newAttrs: string[] | null = [];
    Object.keys(contents).forEach((attr) => {
        if (!Reflect.has(target, attr)) {
            const content = Reflect.get(contents, attr)
            Reflect.set(target, attr, content)
            newAttrs!.push(attr)
        }
    })
    return () => {
        newAttrs!.forEach((attr) => Reflect.deleteProperty(target, attr));
        newAttrs = null;
    }
}