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

  //创建渲染器
  initRender() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //抗锯齿开启
    });
    this.renderer.setClearColor(0xDDDDDD, 1.0); //设置背景颜色
    this.renderer.setSize(this.width, this.height); //设置渲染器宽度和高度
    this.renderer.setPixelRatio(this.devicePixelRatio); //设置设备像素比
    document.body.appendChild(this.renderer.domElement) //把画布显示到页面中
  }

  //初始化场景
  initScene() {
    this.scene = new THREE.Scene();
  }

  //添加相机
  initCamera() {}

  //添加灯光
  initLight() {}

  //添加物体
  initObject() {}

  //渲染成像
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new Main()
}