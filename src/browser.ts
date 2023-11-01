/**
 * @file 浏览器版本的 Monitor
 */
import Monitor from '@/core/monitor';
import dataLegoPlugin from '@/privatePlugins/dataLego';
import browserReportPlugin from '@/privatePlugins/report/browser';

const monitor = new Monitor();
monitor
    .use(dataLegoPlugin)
    .use(browserReportPlugin);

export default monitor;