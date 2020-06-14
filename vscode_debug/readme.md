# vscode debug
node并没有一个官方的开发者工具，不像java，kotlin，C之类的语音，ide自带对断点调试。js在浏览器内，还能用浏览器的断点调试功能。node调试起来就相对比较麻烦。下面介绍如何利用vscode调试node。

vscode有两种调试模式
1. attach
2. launch

两种模式的区别就是，attach可以进入到已经启动的node进程进行调试，前提是node已经通过--inspect启动了监听

## launch模式
以webpack调试为例
1. 在根目录增加.vscode/launch.json
```js
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug"
      ],
      "port": 9229,
      "env": {
        "NODE_ENV": "development" // 通过这里去控制环境变量
      }
    }

  ]
}
```
2. 在package.json的script增加(env要从launch.json传进去)
> node --inspect-brk=9229 ./node_modules/webpack-dev-server/bin/webpack-dev-server.js

3. f5，就可以直接在vscode进行断点调试了。

## attach模式
1. 在使用node命令启动的时候，增加--inspect参数。
2. 在根目录增加.vscode/attach.json
```js
{
  "configurations": [
    {
      "name": "Attach",
      "port": 9229,
      "request": "attach",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "pwa-node"
    },
  ]
}
```
3. f5,就可以愉快的进行调试了。

## 备注
--inspect和--inspect-brk的区别就是，--inspect如果没有任何调试器进入，依旧可以正常运行，就好像约等于没有这个参数。--inspect-brk就是，如果没有调试器进入监听，node服务就不会启动