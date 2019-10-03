import * as THREE from '../miniprogram_npm/three/index.js'
import Rubik from './Rubik.js'
import TouchLine from './TouchLine.js'
const Context = canvas.getContext('webgl');

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.context = Context; //绘图上下文
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio;
    this.viewCenter = new THREE.Vector3(0, 0, 0); //原点
    this.frontViewName = 'front-rubik'; //正视图魔方名称
    this.endViewName = 'end-rubik'; //反视图魔方名称
    this.minPercent = 0.25; //正反视图至少占25%区域

    this.initRender();
    this.initCamera();
    this.initScene();
    this.initLight();
    this.initObject();
    this.initEvent();
    this.render();
  }

  /**
   * 初始化渲染器
   */
  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      context: this.context
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;
    this.renderer.setPixelRatio(this.devicePixelRatio);
  }

  /**
   * 初始化相机
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1500);
    this.camera.position.set(0, 0, 300 / this.camera.aspect);
    this.camera.up.set(0, 1, 0); //正方向
    this.camera.lookAt(this.viewCenter);

    //透视投影相机视角为垂直视角，根据视角可以求出原点所在裁切面的高度，然后已知高度和宽高比可以计算出宽度
    this.originHeight = Math.tan(22.5 / 180 * Math.PI) * this.camera.position.z * 2;
    this.originWidth = this.originHeight * this.camera.aspect;

    //UI元素逻辑尺寸和屏幕尺寸比率
    this.uiRadio = this.originWidth / window.innerWidth;
  }

  /**
   * 初始化场景
   */
  initScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * 初始化光线
   */
  initLight() {
    this.light = new THREE.AmbientLight(0xfefefe);
    this.scene.add(this.light);
  }

  /**
   * 初始化物体
   */
  initObject() {
    //正视图魔方
    this.frontRubik = new Rubik(this);
    this.frontRubik.model(this.frontViewName);

    //反视图魔方
    this.endRubik = new Rubik(this);
    this.endRubik.model(this.endViewName);

    //滑动条
    this.touchLine = new TouchLine(this);
    this.rubikResize((1 - this.minPercent), this.minPercent); //默认正视图占75%区域，反视图占25%区域
  }

  /**
   * 渲染
   */
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this), canvas);
  }

  /**
   * 正反魔方区域占比变化
   */
  rubikResize(frontPercent, endPercent) {
    this.frontRubik.resizeHeight(frontPercent, 1);
    this.endRubik.resizeHeight(endPercent, -1);
  }

  /**
   * 初始化事件
   */
  initEvent() {
    wx.onTouchStart(this.touchStart.bind(this));
    wx.onTouchMove(this.touchMove.bind(this));
    wx.onTouchEnd(this.touchEnd.bind(this));
  }

  /**
   * 触摸开始
   */
  touchStart(event) {
    var touch = event.touches[0];
    //console.log(touch);
    if (this.touchLine.isHover(touch)) {
      this.touchLine.enable();
    }
  }

  /**
   * 触摸移动
   */
  touchMove(event) {
    var touch = event.touches[0];
    if (this.touchLine.isActive) {
      this.touchLine.move(touch.clientY);
      var frontPercent = touch.clientY / window.innerHeight;
      var endPercent = 1 - frontPercent;
      this.rubikResize(frontPercent, endPercent);
    }
  }

  /**
   * 触摸结束
   */
  touchEnd() {
    this.touchLine.disable();
  }
}