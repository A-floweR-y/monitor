/**
 * @file 性能上报插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import { IRequestPluginConfig } from '@tys/publicPlugins/common';
import { ReportDataType, IInterceptKeys } from "@/enum/common";
import { getExcludesAndIncludes } from "@/utils/requestIntercept";
import type { AxiosInstance } from "axios";

const plugin: IMonitorPlugin = {
    name: 'axios-intercept-plugin',
    install({ report: { upload }, options, hooks }, pluginConfig: IRequestPluginConfig & { axios: AxiosInstance }) {
        if (typeof pluginConfig?.['axios' as keyof typeof pluginConfig] === 'undefined') {
            throw new Error('[plugin/axios-plugin]: config 必须传入 axios: AxiosInstance');
        }
        const { includes, excludes } = getExcludesAndIncludes(pluginConfig, options.url, this.name);
        const { axios } = pluginConfig;
        axios.interceptors.request.use(
            (config) => {
                if (
                    config.url
                    && (
                        includes.some((path) => (config.url!).includes(path))
                        || excludes.every((path) => !config.url!.includes(path))
                    )
                ) {
                    Reflect.set(config, IInterceptKeys.REQUEST_TIME, Date.now());
                }
                return config;
            },
        );
        axios.interceptors.response.use(
            (res) => {
                // 上报成功
                const requestTime: number | undefined = Reflect.get(res.config, IInterceptKeys.REQUEST_TIME);
                if (requestTime && res.config.url) {
                    const { pathname } = new URL(res.config.url);
                    upload({
                        type: ReportDataType.AJAX,
                        d: Date.now() - requestTime,
                        r: pathname,
                        hc: res.status,
                        code: Number(res.data.code as string),
                    });
                }
                return res;
            },
            (err) => {
                // 上报失败
                const res = err?.response ?? err
                const requestTime: number | undefined = Reflect.get(res.config, IInterceptKeys.REQUEST_TIME);
                if (requestTime && res?.config?.url) {
                    const { pathname } = new URL(res.config.url);
                    upload({
                        type: ReportDataType.AJAX,
                        d: Date.now() - requestTime,
                        r: pathname,
                        hc: IInterceptKeys.REQUEST_ERROR_STATUS,
                        msg: `${err.name} : ${err.message}`,
                    });
                }
                return err;
            }
        );
    }
};

export default plugin;