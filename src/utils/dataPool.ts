import type { ITaskList, ITask, IUploadFn } from "@tys/dataPool";
import { usePageOnload, usePageBeforeUnload } from "@/utils/tools";
import { isFunction } from "@/utils/assert";

// 任务状态
enum TaskStateEnum {
    INIT = 'init',
    PENDING = 'pending',
    FAIL = 'fail',
}

// 优化下面代码的命名规则
const taskListConfig = {
    // 任务池大小
    maxSize: 30,
    // 任务池定时上报间隔
    reportInterval: 15000,
    // 任务池上报失败重试次数
    reportRetryCount: 3,
}

// 获取需要待处理的任务池
const getTodoTaskList = (taskList: ITaskList): ITask[] => {
    // 遍历任务池，将状态为 init 和 fail 的任务取出
    return Array.from(taskList).filter((item) => item.state === TaskStateEnum.INIT || item.state === TaskStateEnum.FAIL);
};

// 上报函数包装器
const uploadHandler = (todoTasks: ITask[], taskList: ITaskList, uploadFn: IUploadFn) => {
    const dataList = todoTasks.map((task) => {
        task.state = TaskStateEnum.PENDING
        return task.data
    });
    return uploadFn(dataList)
        .then(() => {
            todoTasks.forEach((task) => taskList.delete(task))
        })
        .catch(() => {
            todoTasks.forEach((task) => {
                task.errorHit += 1
                task.state = TaskStateEnum.FAIL

                if (task.errorHit >= (taskListConfig.reportRetryCount)) {
                    taskList.delete(task)
                }
            })
        });
};

// 处理公共的上报逻辑
const uploadCommonHandler = (taskList: ITaskList, uploadFn: IUploadFn, limit: number = 0, done?: Function) => {
    const todoTaskList = getTodoTaskList(taskList);
    // 数据大于某个阈值进行上报
    if (todoTaskList.length > limit) {
        uploadHandler(todoTaskList, taskList, uploadFn).finally(() => {
            if (isFunction(done)) {
                done!();
            }
        });
    }
}

// 添加任务到任务列表
export const addTaskToList = (data: Object, taskList: ITaskList) => {
    taskList.add({
        state: TaskStateEnum.INIT,
        errorHit: 0,
        data,
    });
};

// 倒计时上报
export const intervalReport = (taskList: ITaskList, uploadFn: IUploadFn) => {
    let timer;
    const startLoopUpload = () => {
        timer = setTimeout(
            () => uploadCommonHandler(taskList, uploadFn, 0, startLoopUpload),
            taskListConfig.reportInterval,
        );
    };
    startLoopUpload();
};

// 到达阈值条数上报
export const limitReport = (taskList: ITaskList, uploadFn: IUploadFn) => {
    uploadCommonHandler(taskList, uploadFn, taskListConfig.maxSize);
};

// onload 时上报
export const pageOnloadReport = (taskList: ITaskList, uploadFn: IUploadFn) => {
    usePageOnload(() => uploadCommonHandler(taskList, uploadFn));
};

// 页面卸载时上报
export const pageUnloadReport = (taskList: ITaskList, uploadFn: IUploadFn) => {
    usePageBeforeUnload(() => uploadCommonHandler(taskList, uploadFn));
};