import path from 'node:path';
import pluginCommonjs from '@rollup/plugin-commonjs';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import aliasPlugin from '@rollup/plugin-alias';
import { babel as babelPlugin } from '@rollup/plugin-babel';
import terserPlugin from '@rollup/plugin-terser';
import servePlugin from 'rollup-plugin-dev';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import copyPlugin from 'rollup-plugin-copy';
import { loadJSON, generatePluginOptions, generateBannerPlugin } from './utils/tools.mjs';

const envPlugin = process.env.NODE_ENV === 'production'
    ? [
        // 代码压缩
        terserPlugin({
            maxWorkers: 4,
        }),
    ]
    : [
        // 开发服务
        ...(process.env.NO_SERVER ? [] : [servePlugin({
            dirs: ['dist'],
            proxy: [
                { from: '/fe-ex-api/freport', to: 'https://www.test.meexs.dev/fe-ex-api/freport' }
            ]
        })]),
        // 拷贝开发文件
        copyPlugin({
            targets: [
                { src: 'template/index.html', dest: 'dist' },
            ],
            copyOnce: true,
        }),
    ];

const plugins = [
    // banner 插件
    generateBannerPlugin(path.resolve('./LICENSE.txt')),
    // babel 插件
    babelPlugin({
        extensions: ['.ts'],
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
    }),
    // 路径别名插件
    aliasPlugin({
        entries: [
            {
                find: '@',
                replacement: path.resolve('./src'),
            },
            {
                find: '@root',
                replacement: path.resolve('./'),
            },
            {
                find: '@tys',
                replacement: path.resolve('./types'),
            },
        ],
        customResolver: nodeResolvePlugin({
            extensions: ['.ts', '.js'],
        }),
    }),
    // 导出 commonjs 模块
    pluginCommonjs({
        extensions: ['.js', '.ts'],
    }),
    // 模块引入插件（import 和 require）
    nodeResolvePlugin({
        browser: true,
    }),
    // WebWorker 加载器
    webWorkerLoader(),
    ...envPlugin,
];

const {
    browser: pkgBrowser,
    module: pkgModule
} = loadJSON(path.resolve('./package.json'));
export default [
    // 核心模块配置 - 浏览器基础版
    {
        input: 'src/browser.ts',
        output: [
            {
                file: pkgModule,
                format: 'esm',
            },
            {
                name: 'Monitor',
                file: pkgBrowser,
                format: 'umd',
            },
        ],
        plugins,
    },
    // 核心模块配置 - 浏览器 WebWorker 版
    {
        input: 'src/webworker.ts',
        output: [
            {
                file: './dist/esm/webworker.js',
                format: 'esm',
            },
            {
                name: 'Monitor',
                file: './dist/umd/webworker.js',
                format: 'umd',
            },
        ],
        plugins,
    },
    // 核心模块配置 - nodejs 版
    {
        input: 'src/nodejs.ts',
        output: [
            {
                file: './dist/esm/nodejs.js',
                format: 'esm',
            },
        ],
        plugins,
    },
    // 插件配置
    ...generatePluginOptions(path.resolve('./src/publicPlugins/*/index.ts'), plugins),
];