/**
 * @file 性能上报插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import { IRequestPluginConfig } from '@tys/publicPlugins/common';
import { ReportDataType, IInterceptKeys } from "@/enum/common";
import { proxy } from "ajax-hook";
import { getExcludesAndIncludes } from "@/utils/requestIntercept";

const plugin: IMonitorPlugin = {
    name: 'xml-request-intercept-plugin',
    install({ report: { upload }, options }, pluginConfig: IRequestPluginConfig) {
        const { includes, excludes } = getExcludesAndIncludes(pluginConfig, options.url, this.name);

        proxy({
            //请求发起前进入
            onRequest: (config, handler) => {
                if (
                    includes.some((path) => config.url.includes(path))
                    || excludes.every((path) => !config.url.includes(path))
                ) {
                    Reflect.set(config, IInterceptKeys.REQUEST_TIME, Date.now());
                }

                handler.next(config)
            },
            //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
            onError: (res, handler) => {
                const requestTime: number | undefined = Reflect.get(res, IInterceptKeys.REQUEST_TIME);
                if (requestTime) {
                    const { pathname } = new URL(res.config.url);
                    upload({
                        type: ReportDataType.AJAX,
                        r: pathname,
                        hc: IInterceptKeys.REQUEST_ERROR_STATUS,
                        msg: res.type,
                    });
                }
                handler.next(res)
            },
            //请求成功后进入
            onResponse: (res, handler) => {
                // 上报成功
                const requestTime: number | undefined = Reflect.get(res, IInterceptKeys.REQUEST_TIME);
                if (requestTime) {
                    const { pathname } = new URL(res.config.url);
                    upload({
                        type: ReportDataType.AJAX,
                        d: Date.now() - requestTime,
                        r: pathname,
                        hc: res.status,
                        code: Number(res.response.code as string),
                    });
                }
                handler.next(res)
            },
        });
    }
};

export default plugin;