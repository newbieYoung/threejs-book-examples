import * as THREE from '../miniprogram_npm/three/index.js'
import Rubik from './Rubik.js'
import '../plugin/OrbitControls.js'

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio;
    this.viewCenter = new THREE.Vector3(0, 0, 0); //原点

    this.initRender();
    this.initCamera();
    this.initScene();
    this.initLight();
    this.initObject();
    this.render();
  }

  /**
   * 创建渲染器
   */
  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas
    });
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    this.renderer.setPixelRatio(this.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
  }

  /**
   * 添加相机
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1500);
    this.camera.position.set(0, 0, 300 / this.camera.aspect);
    this.camera.up.set(0, 1, 0); //正方向
    this.camera.lookAt(this.viewCenter);

    //轨道视角控制器
    this.orbitController = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.orbitController.enableZoom = false;
    this.orbitController.rotateSpeed = 2;
    this.orbitController.target = this.viewCenter; //设置控制点
  }

  /**
   * 初始化场景
   */
  initScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * 添加灯光
   */
  initLight() {
    this.light = new THREE.AmbientLight(0xfefefe);
    this.scene.add(this.light);
  }

  /**
   * 添加物体
   */
  initObject() {
    var rubik = new Rubik(this);
    rubik.model();
  }

  /**
   * 渲染成像
   */
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}