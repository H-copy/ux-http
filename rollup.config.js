import path from 'path'
import packageJSON from './package.json'
import pluginResolve from '@rollup/plugin-node-resolve' // 依赖引用插件
import pluginCommonjs from '@rollup/plugin-commonjs' // commonjs模块转换插件
import pluginEslint from '@rollup/plugin-eslint' // eslint插件
import pluginTypescript2 from 'rollup-plugin-typescript2' // typescript
import pluginTerser from 'rollup-plugin-terser' // 压缩
const getPath = _path => path.resolve(__dirname, _path)


const extensions = [
  '.js',
  '.ts',
  '.tsx'
]


const eslintConf = {
  throwOnError: true,
  include: ['src/**'],
  exclude: ['node_modules/**', 'lib/**']
}

const mini = {
  input: getPath('./src/index.js'),
  external: ['uni'],
  plugins: [
    // pluginEslint(eslintConf),
    pluginResolve(extensions),
    pluginCommonjs(),
    // pluginTypescript2({
    //   tsconfig: getPath('./tsconfig.mini.json'),
    //   extensions
    // }),
    pluginTerser.terser()
  ],
  output:{
    name: packageJSON.name,
    file: packageJSON.main,
    format: 'umd'
  }
}

const esm = {
  input: getPath('./src/index.js'),
  external: ['uni'],
  plugins: [
    // pluginEslint(eslintConf),
    pluginResolve(extensions),
    pluginCommonjs(),
    // pluginTypescript2({
    //   tsconfig: getPath('./tsconfig.json'),
    //   extensions
    // }),
  ],
  output:{
    name: packageJSON.name,
    file: packageJSON.module,
    format: 'esm'
  }
}

export default [mini, esm]

// const tsPlugin = ts({
//   tsconfig: getPath('./tsconfig.json'),
//   extensions
// })

// const esPlugin = eslint({
//   throwOnError: true,
//   include: ['src/**/*.ts'],
//   exclude: ['node_modules/**', 'lib/**', 'src/**/__test__/**']
// })

// const commonConf = {
//   input: getPath('./src/index.ts'),
//   external: ['vue'],
//   plugins:[
//     resolve(extensions),
//     commonjs(),
//     esPlugin,
//     tsPlugin,
//   ],
//   output: [
//     { name: packageJSON.name,  globals:{ vue: 'vue' }, file: packageJSON.main, format: 'umd' },
//     { name: packageJSON.name,  globals:{ vue: 'vue' }, file: packageJSON.module, format: 'es' },
//   ]
// }

// export default commonConf