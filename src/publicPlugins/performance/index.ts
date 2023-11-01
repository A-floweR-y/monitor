/**
 * @file 性能上报插件
 */
import type { IMonitorPlugin } from "@tys/plugin";
import { useWebVitals } from "./webVitals";
import { useNavigation } from "./navigation";

const plugin: IMonitorPlugin = {
    name: 'performance-plugin',
    install({ report: { upload }, options, hooks }, pluginConfig) {
        useWebVitals(upload);
        useNavigation(upload)
    }
};

export default plugin;