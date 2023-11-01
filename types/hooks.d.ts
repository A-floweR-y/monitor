interface IHook {
    on(eventName: string, handler: Function): IUnHook,
    off(eventName: string, handler?: Function): void,
    once<T>(eventName: string, handler: Function): IUnHook,
}

// 卸载 hooks
export interface IUnHook {
    (): void,
}

// 绑定 hooks
export interface IOnHook {
    (eventName: string, handler: Function): IUnHook,
}

// 同步并行钩子
export interface ISyncHook extends IHook {
    emit<T>(eventName: string, data: T): void
}

// 同步串行钩子
export interface ISyncWaterfallHook extends IHook {
    emit<T>(eventName: string, data: T): T
}

// 钩子集合
export interface IHooksMenu {
    syncHook: ISyncHook,
    syncWaterfall: ISyncWaterfallHook
}
