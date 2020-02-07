import * as THREE from '../miniprogram_npm/three/index.js'

export default class Slide {

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
    this.targetRubik = null; //目标魔方
    this.anotherRubik = null; //其它魔方
    this.isRotating = false; //是否正在自动转动
    this.isSliding = false; //是否在手动转动
    this.touch = null;
    this.startTouch = null;
    this.startPoint = null;
    this.startNormalize = null;
    this.moveTouch = null;
    this.movePoint = null;
    this.moveNormalize = null;
  }

  /**
   * 开始
   */
  start(event) {
    this.getIntersects(event);
    if (this.intersect.length > 0) { //操控魔方
      this.startTouch = this.touch;
      this.startPoint = this.intersect;
      this.startNormalize = this.normalize;
    } else { //不操控魔方
      this.startTouch = event.touches;
      this.startPoint = new THREE.Vector2(this.startTouch[0].clientX, this.startTouch[0].clientY);
    }
  }

  /**
   * 滑动
   */
  move(event){
    if(this.startNormalize && this.startNormalize.length > 0){ // 操控魔方
      if(!this.isSliding){ // 未手动转动
        this.getIntersects(event);
        if (this.intersect.length > 0) { // 操控魔方
          this.moveTouch = this.touch;
          this.movePoint = this.intersect;
          this.moveNormalize = this.normalize;
          this.targetRubik.slideMove(this.startTouch, this.moveTouch, this.anotherRubik, this.startPoint, this.startNormalize, this.movePoint, this.moveNormalize);
        }
      }else{

      }
    }else{ // 不操控魔方

    }
  }

  /**
   * 获取射线投射元素和射线投射平面法向量
   */
  getIntersects(event){
    var points = [];
    var vectors = [];
    var events = [];

    var touchs = event.touches;

    //根据第一个触摸点和控制条位置区分正反视图中的魔方
    var firstTouch = touchs[0];
    var touchLine = this.main.touchLine;
    if (touchLine.screenRect.top > firstTouch.clientY) {
      this.targetRubik = this.main.frontRubik;
      this.anotherRubik = this.main.endRubik;
    } else if (touchLine.screenRect.top + touchLine.screenRect.height < firstTouch.clientY) {
      this.targetRubik = this.main.endRubik;
      this.anotherRubik = this.main.frontRubik;
    }

    if (this.targetRubik) {
      //排除掉不在主操作视图内的触摸点
      var results = [];
      var rubikTypeName = this.targetRubik.group.childType;
      for (var i = 0; i < touchs.length; i++) {
        var touch = touchs[i];
        if ((rubikTypeName == this.main.endViewName && touchLine.screenRect.top + touchLine.screenRect.height < touch.clientY) || (rubikTypeName == this.main.frontViewName && touchLine.screenRect.top > touch.clientY)) {
          results.push(touch);
        }
      }

      //获取射线投射结果
      var width = this.main.width;
      var height = this.main.height;
      for (var i = 0; i < results.length; i++) {
        var item = results[i];
        var mouse = new THREE.Vector2();
        mouse.x = (item.clientX / width) * 2 - 1;
        mouse.y = -(item.clientY / height) * 2 + 1;
        this.raycaster.setFromCamera(mouse, this.main.camera);
        var intersects = this.raycaster.intersectObjects(this.targetRubik.group.children);
        if (intersects.length >= 2) { // 外层透明容器以及魔方小方块，至少有两个元素
          vectors.push(intersects[0].face.normal);
          points.push(intersects[1]);
          events.push(item);
        }
      }
    }

    this.intersect = points;
    this.normalize = vectors;
    this.touch = events;
  }
}