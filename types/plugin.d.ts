import type { IMonitorHooks, IMonitorInstance, IMonitorOptions, IMonitorReport } from '@tys/monitor';

export type IPluginExtend = IMonitorInstance['extend'];

export type IPluginReport = Required<IMonitorReport>;

export type IPluginOptions = Required<IMonitorOptions>;

export type IPluginHooks = IMonitorHooks;

export type IPluginUpload = (data: Object) => void;

export interface IPluginUtils {
    extend: IPluginExtend,
    report: IPluginReport,
    options: IPluginOptions,
    hooks: IPluginHooks
}

// 插件接口
export interface IMonitorPlugin {
    name: string,
    install(utils: IPluginUtils, pluginConfig?: Object): void
}