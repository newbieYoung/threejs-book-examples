import * as THREE from 'three'
import {
  Mesh
} from 'three';

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
    this.renderer.setClearColor(0xFFFFFF, 1.0); //设置背景颜色
    this.renderer.setSize(this.width, this.height); //设置渲染器宽度和高度
    this.renderer.setPixelRatio(this.devicePixelRatio); //设置设备像素比
    document.body.appendChild(this.renderer.domElement) //把画布显示到页面中
  }

  //初始化场景
  initScene() {
    this.scene = new THREE.Scene();
  }

  //添加相机
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.set(200, 400, 600); // 位置
    this.camera.up.set(0, 1, 0); //上方向
    this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 焦点
    this.scene.add(this.camera);
  }

  //添加灯光
  initLight() {
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0); // 环境光
    //this.scene.add(this.ambientLight);
  }

  //添加物体
  initObject() {
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

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