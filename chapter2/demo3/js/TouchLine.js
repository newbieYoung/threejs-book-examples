import * as THREE from '../miniprogram_npm/three/index.js'

export default class TouchLine {

  constructor(main) {
    this.main = main;
    this.isActive = false;
    this.radio = this.main.originWidth / 750;
    this.uiRadio = this.main.uiRadio;
    this.setSize(750, 64);
    this.loadImage('images/touch-line.png')
  }

  /**
   * 加载图片
   */
  loadImage(url) {
    var self = this;
    var texture = new THREE.TextureLoader().load(url)
    var geometry = new THREE.PlaneBufferGeometry(self.width, self.height);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    self.plane = new THREE.Mesh(geometry, material);
    self.defaultPosition();
    self.showInScene();
  }

  /**
   * 显示
   */
  showInScene() {
    this.main.scene.add(this.plane);
  }

  /**
   * 隐藏
   */
  hideInScene() {
    this.main.scene.remove(this.plane);
  }

  /**
   * 设置尺寸
   */
  setSize(width, height) {
    //实际尺寸
    this.realWidth = width;
    this.realHeight = height;

    //逻辑尺寸
    this.width = this.realWidth * this.radio;
    this.height = this.realHeight * this.radio;

    //屏幕尺寸
    this.screenRect = {
      width: this.width / this.main.uiRadio,
      height: this.height / this.main.uiRadio
    }
  }

  /**
   * 默认位置
   */
  defaultPosition() {
    this.enable();
    this.screenRect.left = 0;
    this.screenRect.top = window.innerHeight / 2 - this.screenRect.height / 2;
    this.move(window.innerHeight * (1 - this.main.minPercent));
    this.disable();
  }

  /**
   * 激活（可操作状态）
   */
  enable() {
    this.isActive = true;
  }

  /**
   * 关闭（不可操作状态）
   */
  disable() {
    this.isActive = false;
  }

  /**
   * 移动
   */
  move(y) {
    if (this.isActive) {
      if (y < window.innerHeight * this.main.minPercent){
        y = window.innerHeight * this.main.minPercent;
      } else if (y > window.innerHeight * (1 - this.main.minPercent)){
        y = window.innerHeight * (1 - this.main.minPercent);
      }
      
      var len = this.screenRect.top + this.screenRect.height / 2 - y; //屏幕移动距离
      var percent = len / window.innerHeight;
      var len2 = this.main.originHeight * percent;
      this.plane.position.y += len2;

      this.screenRect.top = y - this.screenRect.height / 2;
    }
  }

  /**
   * 判断元素是否获得焦点
   */
  isHover(touch) {
    if (touch.clientY >= this.screenRect.top && touch.clientY <= this.screenRect.top + this.screenRect.height && touch.clientX >= this.screenRect.left && touch.clientX <= this.screenRect.left + this.screenRect.width) {
      return true;
    }
    return false;
  }
}