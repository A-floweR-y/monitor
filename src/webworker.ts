/**
 * @file 浏览器使用 WebWorker 上报数据的 Monitor
 */
import Monitor from '@/core/monitor';
import dataLegoPlugin from '@/privatePlugins/dataLego';
import webworkerReportPlugin from '@/privatePlugins/report/webworker';

const monitor = new Monitor();
monitor
    .use(dataLegoPlugin)
    .use(webworkerReportPlugin);

export default monitor;