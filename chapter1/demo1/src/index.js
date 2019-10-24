import * as THREE from 'three'

//应用主逻辑
class Main {

  constructor() {
    this.initRender();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initObject();
    this.render();
  }

  /**
   * 创建渲染器
   */
  initRender() {

  }

  /**
   * 初始化场景
   */
  initScene() {

  }

  /**
   * 添加相机
   */
  initCamera() {

  }

  /**
   * 添加灯光
   */
  initLight() {

  }

  /**
   * 添加物体
   */
  initObject() {

  }

  /**
   * 渲染成像
   */
  render() {

  }
}

window.onload = function () {
  new Main()
}