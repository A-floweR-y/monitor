/**
 * @file nodejs 版本的 Monitor
 */
import Monitor from '@/core/monitor';
import dataLegoPlugin from '@/privatePlugins/dataLego';
import nodejsReportPlugin from '@/privatePlugins/report/nodejs';

const monitor = new Monitor();
monitor
    .use(dataLegoPlugin)
    .use(nodejsReportPlugin);

export default monitor;