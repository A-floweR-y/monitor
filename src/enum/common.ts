/**
 * @file 公共的枚举文件
 */

// Monitor 的 Hooks
export enum MonitorHooks {
    INIT = 'init',
    BEFORE_UPLOAD = 'beforeUpload',
    AFTER_UPLOAD = 'afterUpload',
    UNINSTALL = 'uninstall',
}

// 上报数据类型
export enum ReportDataType {
    // 接口数据
    AJAX = 'ajax',
    // 性能数据
    PERFORMANCE = 'performance',
}

// 请求拦截器使用到的 Key
export enum IInterceptKeys {
    REQUEST_TIME = '_request_time',
    REQUEST_ERROR_STATUS = 0,
}