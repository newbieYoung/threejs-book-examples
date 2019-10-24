## 正反视图

## 安装

在项目描述文件`package.json`所在目录依次执行以下命令：

```bash
npm install
```

安装完成之后点击微信开发者工具中的菜单栏：`工具 -> 构建 npm`。

## 目录介绍

```
├── adapter                   //微信小游戏兼容脚本源代码目录
├── plugin                    //ThreeJS 插件
│   └── OrbitControls.js      //轨道视角控制器
├── js                        //逻辑脚本目录
│   ├── Rubik.js              //魔方对象
│   ├── TouchLine.js          //UI 控制条
│   └── main.js
├── miniprogram_npm           //微信开发者工具构建 npm 包目录
│   └── three
├── node_modules              //npm 下载的第三方包目录
├── package.json              //npm 项目描述文件
├── game.js                   //微信小游戏入口文件
└── game.json                 //微信小游戏配置文件
```
