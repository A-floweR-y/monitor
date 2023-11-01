// 获取 Onload 耗时
export const getOnload = () => {
    // loadEventStart: 页面加载完成开始执行 onload 事件的监听函数
    // fetchStart: 对页面开始发起请求的耗时，因为前面需要卸载上一个页面，可能还需要请求重定向
    // 不使用 duration, 是因为 duration 包含了从上一个页面开始到页面 onload 监听函数执行完毕的整体耗时
    // 我们只需要知道页面从请求开始到加载完成的耗时更符合我们的需求
    const { loadEventStart, fetchStart } = window.performance.getEntriesByType('navigation')[0];
    return Math.round(loadEventStart - fetchStart);
}

// 获取FP耗时
export const getFP = () => {
    for (const { name, duration } of window.performance.getEntriesByType('paint')) {
        if (name === 'first-paint') {
            return Math.round(duration);
        }
    }
    return 0;
}