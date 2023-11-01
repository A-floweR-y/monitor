import type { IPluginUpload } from '@tys/plugin';
import { ReportDataType } from '@/enum/common';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

export const useWebVitals = (upload: IPluginUpload) => {
    [onCLS, onFCP, onFID, onINP, onLCP, onTTFB].forEach((cb) => {
        cb(({ name, value }) => {
            upload({
                type: ReportDataType.PERFORMANCE,
                name: name.toLowerCase(),
                d: Math.round(value),
            });
        });
    });
}