// 定义项目发布阶段需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    // 用于build时自动移除 console 打印信息
    // 'transform-remove-console'
    // 只在发布时启用的插件
    ...prodPlugins,
    /* 路由懒加载插件 */
    '@babel/plugin-syntax-dynamic-import'
  ]
}
