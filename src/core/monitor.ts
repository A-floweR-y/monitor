import type {
    IMonitorConstructor,
    IMonitorInstance,
    IMonitorOptions,
    IMonitorHooks,
    IMonitorReport,
    IUnExtend
} from "@tys/monitor";
import type { IMonitorPlugin, IPluginUtils } from "@tys/plugin";
import { loadPlugin, useHooks, mergeExtends } from "@/utils/monitor";
import { MonitorHooks } from "@/enum/common";
import { isFunction, isObject, isString, isSymbol } from "@/utils/assert";
import { singleHooks } from "@/core/hooks";

const M: IMonitorConstructor = class Monitor implements IMonitorInstance {
    private _options: IMonitorOptions

    hooks: IMonitorHooks

    report: IMonitorReport

    constructor() {
        const reportUrl = '/fe-ex-api/freport';
        this._options = {
            url: reportUrl,
            appid: '',
            debug: false,
            requestIntercept: {
                excludes: [reportUrl],
                includes: [],
            },
        };
        this.hooks = useHooks(singleHooks);
        this.report = {};
    }

    init(options?: IMonitorOptions) {
        if (isObject(options)) {
            this._options = {
                ...this._options,
                ...options,
            }
        }
        singleHooks.syncHook.emit(
            MonitorHooks.INIT,
            Object.assign({}, this._options),
        );
    }

    use(plugin: IMonitorPlugin, config?: Object): IMonitorInstance {
        this._use(plugin, config);
        return this;
    }

    useAsync(url: string, config?: Object): IMonitorInstance {
        loadPlugin(url).then((plugin) => this._use(plugin, config));
        return this;
    }

    private _use(plugin: IMonitorPlugin, config?: Object) {
        if (!isObject(plugin)) {
            throw new Error('[Monitor.use]: 插件应该是一个 Object 对象');
        }

        if (!isString(plugin.name) && !isSymbol(plugin.name)) {
            throw new Error('[Monitor.use]: 插件应该指定一个类型为 string | symbol 的 name, 用于插件的安装和卸载');
        }

        if (!isFunction(plugin.install)) {
            throw new Error('[Monitor.use]: 插件应该指定一个 key 为 install 的安装函数');
        }

        this.hooks.init(() => {
            const utils = {
                extend: this.extend.bind(this),
                options: Object.assign({}, this._options),
                hooks: Object.assign({}, this.hooks),
                report: Object.assign({}, this.report),
            };
            // 安装插件
            plugin.install(utils as IPluginUtils, config);
        });
    }

    extend<T>(attr: string, content: T): IUnExtend {
        let unExtend: IUnExtend;
        if (Reflect.has(this, attr)) {
            if (isObject(content) && isObject(this[attr as keyof typeof this])) {
                unExtend = mergeExtends(this[attr as keyof typeof this] as Object, content as Object)
            } else {
                throw new Error(`[Monitor.extend]: Monitor 已存在 ${attr} 属性，不允许覆盖`)
            }
        } else {
            Reflect.set(this, attr, content)
            unExtend = () => Reflect.deleteProperty(this, attr)
        }
        return unExtend;
    }
}

export default M;