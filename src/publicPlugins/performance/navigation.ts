import type { IPluginUpload } from '@tys/plugin';
import { ReportDataType } from '@/enum/common';
import { usePageOnload } from '@/utils/tools';
import { getOnload, getFP } from './utils';

export const useNavigation = (upload: IPluginUpload) => {
    usePageOnload(() => {
        // 这里要使用 setTimeout 是因为要把获取 PerformanceNavigationTiming 对象的时机放到下一次 EventLoop
        // 因为当 usePageOnload 的回调函数执行时机为页面开始执行监听 onload 函数的回调时
        setTimeout(() => {
            // 上报 onload 数据
            upload({
                type: ReportDataType.PERFORMANCE,
                name: 'onload',
                d: getOnload(),
            });

            // 上报 FP 数据
            upload({
                type: ReportDataType.PERFORMANCE,
                name: 'fp',
                d: getFP(),
            });
        }, 0);
    });
}