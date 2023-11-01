// 是否是 Object
export const isObject = <T>(target: T) => Object.prototype.toString.call(target) === '[object Object]';

// 是否是字符串
export const isString = <T>(target: T) => typeof target === 'string';

// 是否是 Symbol
export const isSymbol = <T>(target: T) => typeof target === 'symbol';

// 是否是 Function
export const isFunction = <T>(target: T) => typeof target === 'function';

// 是否是 Number
export const isNumber = <T>(target: T) => typeof target === 'number';

// 是否是布尔值
export const isBoolean = <T>(target: T) => typeof target === 'boolean';

// 是否是移动端
export const isMobile = () => /(ipod|ipad|iphone|android|mobile)/.test(navigator.userAgent.toLowerCase())