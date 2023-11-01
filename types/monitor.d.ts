import type { IMonitorPlugin } from "@tys/plugin";
import { IUnHook } from "@tys/hooks";
import { IUploadFn } from "@tys/dataPool";

// Monitor 构造函数
export interface IMonitorConstructor {
    new (options?: IMonitorOptions): IMonitorInstance,
}

// Monitor 实例
export interface IMonitorOptions {
    // 请求地址
    url: string,
    // 项目标识
    appid: string,
    // 是否开启 debug
    debug: boolean,
    // 其他扩展
    [key: string]: unknown,
}

// 卸载插件扩展的内容
export type IUnExtend = () => void;

// Monitor hooks
export interface IMonitorHooks {
    init(handler: Function): IUnHook,
    beforeUpload(handler: Function): IUnHook,
    afterUpload(handler: Function): IUnHook,
    uninstall(handler: Function): IUnHook,
}

// Monitor report
export interface IMonitorReport {
    upload?: (data: Object) => void,
    uploadOnce?:  (data: Object) => void,
}

// Monitor 的实例对象
export interface IMonitorInstance {
    hooks: IMonitorHooks,
    use(plugin: IMonitorPlugin, config?: Object): IMonitorInstance,
    useAsync(url: string, config?: Object): IMonitorInstance,
    extend<T>(attr: string, content: T): IUnExtend,
}