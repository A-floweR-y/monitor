/**
 * @file 用于 Node 上报的数据池
 */

import type { ITaskList, IUploadFn } from "@tys/dataPool";
import { addTaskToList, intervalReport, limitReport } from "@/utils/dataPool";

export default (uploadFn: IUploadFn) => {
    // 任务池
    const taskList: ITaskList = new Set();
    // 数据定时上报
    intervalReport(taskList, uploadFn);
    // 单次
    const uploadOnce = (data: Object) => uploadFn([data]);
    const upload = (data: Object) => {
        addTaskToList(data, taskList);
        // 到达条数上报
        limitReport(taskList, uploadFn);
    };

    return {
        upload,
        uploadOnce,
    };
}