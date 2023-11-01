import { IRequestPluginConfig } from "@tys/publicPlugins/common";

// 获取 excludes 和 includes
export const getExcludesAndIncludes = (
    config: IRequestPluginConfig,
    reportUrl: string,
    pluginName: string,
) => {
    if (config?.excludes && !Array.isArray(config.excludes)) {
        throw new Error(`[plugin/${pluginName}]: config.excludes 必须是数组`);
    }

    if (config?.includes && !Array.isArray(config.includes)) {
        throw new Error(`[plugin/${pluginName}]: config.includes 必须是数组`);
    }

    const excludes = [
        // 排除数据上报的url
        reportUrl,
        ...(config?.excludes ?? []),
    ];
    const includes = config?.includes ?? [];
    return {
        excludes,
        includes,
    };
}