// 请求配置
export interface IRequestConfig {
    method?: 'POST' | 'GET',
    timeout?: number,
    headers?: {
        [prop: string]: string
    },
    [prop: string]: unknown,
}

// 请求方法
export interface IRequestFn {
    <T>(url: string, data: T, config?: IRequestConfig): Promise<Object | void>
}