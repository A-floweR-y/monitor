import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import { glob } from 'glob';
import licensePlugin from "rollup-plugin-license";

// 同步加载 JSON 文件
export const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

// 生成插件的通用配置
export const generatePluginOptions = (globPath, plugins) => {
    return glob.sync(globPath).map((file) => {
        const filename = path.dirname(file).split('/').at(-1);
        const pluginName = `${filename}Plugin`;
        return {
            input: {
                [`plugins/${filename}`]: url.fileURLToPath(new URL(file, import.meta.url)),
            },
            output: [
                {
                    dir: 'dist/esm',
                    format: 'esm',
                },
                {
                    name: pluginName,
                    dir: 'dist/umd',
                    format: 'umd',
                },
            ],
            plugins,
        };
    });
};

// 生成 banner 函数
export const generateBannerPlugin = (filepath) => {
    return licensePlugin({
        banner: {
            commentStyle: 'regular',
            content: {
                file: filepath,
            }
        },
    });
}