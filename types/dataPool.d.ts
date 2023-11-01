// 单个任务对象
export interface ITask {
    state: string
    data: Object
    errorHit: number
}

// 数据池对象
export type ITaskList = Set<ITask>

// 数据池上报数据的方法
export interface IUploadFn {
    (dataList: Object[]): Promise<Object | void>
}