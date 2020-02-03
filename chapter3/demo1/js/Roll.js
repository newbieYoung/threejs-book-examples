import * as THREE from '../miniprogram_npm/three/index.js'

export default class Roll {

  constructor(main) {
    this.main = main;
    this.raycaster = new THREE.Raycaster();//射线投射对象
    this.reset();
  }

  /**
   * 重置
   */
  reset(){
    this.intersect = null; //射线投射元素
    this.normalize = null; //射线投射平面法向量
    this.targetRubik = null; //射线投射魔方
    this.anotherRubik = null; //其它魔方
    this.isRotating = false; //是否正在转动魔方
    this.isSliding = false; //魔方是否在滑动
    this.touch = null;
    this.startTouch = null;
    this.startPoint = null;
    this.startNormalize = null;
    this.moveTouch = null;
    this.movePoint = null;
    this.moveNormalize = null;
  }

  /**
   * 获取射线投射元素和射线投射平面法向量
   */
  getIntersects(event){

  }
}