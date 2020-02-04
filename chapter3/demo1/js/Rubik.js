import * as THREE from '../miniprogram_npm/three/index.js'

//基础模型参数
const BasicParams = {
  x: 0,
  y: 0,
  z: 0,
  num: 3,
  len: 50,
  //右、左、上、下、前、后
  colors: ['#ff6b02', '#dd422f',
    '#ffffff', '#fdcd02',
    '#3d81f7', '#019d53'
  ]
};

/**
 * 简易魔方
 * x、y、z 魔方中心点坐标
 * num 魔方阶数
 * len 小方块宽高
 * colors 魔方六面体颜色
 */
function SimpleCube(x, y, z, num, len, colors) {
  //魔方左上角坐标
  var leftUpX = x - num / 2 * len;
  var leftUpY = y + num / 2 * len;
  var leftUpZ = z + num / 2 * len;

  //根据颜色生成材质
  var materialArr = [];
  for (var i = 0; i < colors.length; i++) {
    var texture = new THREE.Texture(faces(colors[i]));
    texture.needsUpdate = true;
    var material = new THREE.MeshLambertMaterial({
      map: texture
    });
    materialArr.push(material);
  }

  var cubes = [];
  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num * num; j++) {
      var cubegeo = new THREE.BoxGeometry(len, len, len);
      var cube = new THREE.Mesh(cubegeo, materialArr);

      //依次计算各个小方块中心点坐标
      cube.position.x = (leftUpX + len / 2) + (j % num) * len;
      cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len;
      cube.position.z = (leftUpZ - len / 2) - i * len;
      cubes.push(cube)
    }
  }
  return cubes;
}

/**
 * 生成canvas素材
 */
function faces(rgbaColor) {
  var canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  var context = canvas.getContext('2d');
  //外部黑色正方形
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fillRect(0, 0, 256, 256);
  //内部特定颜色圆角正方形
  context.rect(16, 16, 224, 224);
  context.lineJoin = 'round';
  context.lineWidth = 16;
  context.fillStyle = rgbaColor;
  context.strokeStyle = rgbaColor;
  context.stroke();
  context.fill();
  return canvas;
}

export default class Rubik {
  constructor(main) {
    this.main = main;

    this.initStatus = []; // 初始状态

    this.names = ['x','-x','y','-y','z','-z'];
    this.localLines = [
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(-1,0,0),
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(0,-1,0),
      new THREE.Vector3(0,0,1),
      new THREE.Vector3(0,0,-1)
    ]; //自身坐标系坐标轴向量
    this.worldLines = []; //自身坐标系坐标轴向量在世界坐标系中的值
  }

  model(type) {
    //创建集合
    this.group = new THREE.Group();
    this.group.childType = type;

    //生成小方块
    this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors);
    for (var i = 0; i < this.cubes.length; i++) {
      var item = this.cubes[i];
      this.initStatus.push({
        x: item.position.x,
        y: item.position.y,
        z: item.position.z,
        cubeIndex: item.id
      });
      item.cubeIndex = item.id;

      //小方块不再直接加入场景了，而是先加入集合，然后再把集合加入场景。
      //this.main.scene.add(item);
      this.group.add(item);
    }

    //外层透明容器
    var width = BasicParams.num * BasicParams.len + 2; // 额外加入一定宽度，防止外层容器和魔方完全重叠
    var containerGeo = new THREE.BoxGeometry(width, width, width);
    var containerMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });
    this.container = new THREE.Mesh(containerGeo, containerMat);
    this.group.add(this.container);

    //进行一定的旋转变换保证三个面可视
    if (type == this.main.frontViewName) {
      this.group.rotateY(45 / 180 * Math.PI);
    } else {
      this.group.rotateY((270 - 45) / 180 * Math.PI);
    }
    this.group.rotateOnAxis(new THREE.Vector3(1, 0, 1), 25 / 180 * Math.PI);
    this.main.scene.add(this.group);
  }

  /**
   * 根据所占界面的比例设置魔方视图高度
   */
  resizeHeight(percent, transformTag) {
    if (percent < this.main.minPercent) {
      percent = this.main.minPercent;
    }
    if (percent > (1 - this.main.minPercent)) {
      percent = 1 - this.main.minPercent;
    }
    this.group.scale.set(percent, percent, percent);
    this.group.position.y = this.main.originHeight * (0.5 - percent / 2) * transformTag;
  }

  /**
   * 更新自身坐标系坐标轴向量在世界坐标系中的值
   */
  updateLocalAxisInWorld() {
    this.worldLines = [];
    var matrix = this.group.matrixWorld;
    for(var i=0;i<this.localLines.length;i++){
      var line = this.localLines[i];
      this.worldLines.push(line.applyMatrix4(matrix));
    }
  }

  /**
   * 根据向量在世界坐标系中的值获取其名称
   */
  getWorldName(line){
    for(var i=0;i<this.worldLines.length;i++){
      if(line.equals(this.worldLines[i])){
        return this.names[i];
      }
    }
  }

  /**
   * 根据向量在自身坐标系中的值获取其名称
   */
  getLocalName(line){
    for(var i=0;i<this.localLines.length;i++){
      if(line.equals(this.localLines[i])){
        return this.names[i]
      }
    }
  }

  /**
   * 获取转动类型
   */
  getRollType(axis, normalize){
    var faceName = this.getLocalName(normalize);
    var direcName = this.getWorldName(axis);
    return direcName + '|' + faceName;
  }

  /**
   * 计算转动向量
   */
  getDirectionAxis(sub) {
    this.updateCurLocalAxisInWorld();
    
    var angles = [];
    for (var i = 0; i < this.worldLines.length; i++){
      var line = this.worldLines[i];
      angles.push(sub.angleTo(line)); //计算两个向量夹角
    }
    
    var min = 0;
    for(var j = 1; j < angles.length; j++){
      if(angles[j] < angles[min]){
        min = j;
      }
    }

    return this.worldLines[min].clone();
  }

  /**
   * 转动参数重置
   */
  rollReset() {
    this.rollElements = null;
    this.rollType = null;
    this.rollAngle = null;
    this.rollAbsAngle = null;
    this.rollStartTime = null;
    this.rollCurrentTime = null;
  }

  /**
   * 更新位置索引
   */
  updateCubeIndex(elements) {
    for (var i = 0; i < elements.length; i++) {
      var temp1 = elements[i];
      for (var j = 0; j < this.initStatus.length; j++) {
        var temp2 = this.initStatus[j];
        if (Math.abs(temp1.position.x - temp2.x) <= this.cubeLen / 2 &&
          Math.abs(temp1.position.y - temp2.y) <= this.cubeLen / 2 &&
          Math.abs(temp1.position.z - temp2.z) <= this.cubeLen / 2) {
          temp1.cubeIndex = temp2.cubeIndex;
          break;
        }
      }
    }
  }

  /**
   * 绕过点p的向量vector旋转一定角度
   */
  rotateAroundWorldAxis(p, vector, rad) {
    vector.normalize();
    var u = vector.x;
    var v = vector.y;
    var w = vector.z;

    var a = p.x;
    var b = p.y;
    var c = p.z;

    var matrix4 = new THREE.Matrix4();

    matrix4.set(u * u + (v * v + w * w) * Math.cos(rad), u * v * (1 - Math.cos(rad)) - w * Math.sin(rad), u * w * (1 - Math.cos(rad)) + v * Math.sin(rad), (a * (v * v + w * w) - u * (b * v + c * w)) * (1 - Math.cos(rad)) + (b * w - c * v) * Math.sin(rad),
      u * v * (1 - Math.cos(rad)) + w * Math.sin(rad), v * v + (u * u + w * w) * Math.cos(rad), v * w * (1 - Math.cos(rad)) - u * Math.sin(rad), (b * (u * u + w * w) - v * (a * u + c * w)) * (1 - Math.cos(rad)) + (c * u - a * w) * Math.sin(rad),
      u * w * (1 - Math.cos(rad)) - v * Math.sin(rad), v * w * (1 - Math.cos(rad)) + u * Math.sin(rad), w * w + (u * u + v * v) * Math.cos(rad), (c * (u * u + v * v) - w * (a * u + b * v)) * (1 - Math.cos(rad)) + (a * v - b * u) * Math.sin(rad),
      0, 0, 0, 1);

    return matrix4;
  }

  /**
   * 转动一定角度
   */
  rotate(elements, rollType, angle) {
    var rotateMatrix = new THREE.Matrix4();//旋转矩阵
    var origin = new THREE.Vector3(0, 0, 0);
    //this.names = ['x','-x','y','-y','z','-z'];

    switch (rollType) {
      case 'x|y':
      case '-x|-y':
      case 'y|-x':
      case '-y|x':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wZLine, -angle);
        break;
      case 'x|-y':
      case '-x|y':
      case 'y|x':
      case '-y|-x':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wZLine, angle);
        break;
      case 'x|-z':
      case '-x|z':
      case 'z|x':
      case '-z|-x':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wYLine, -angle);
        break;
      case '-x|-z':
      case 'x|z':
      case 'z|-x':
      case '-z|x':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wYLine, angle);
        break;
      case 'y|-z':
      case '-y|z':
      case 'z|y':
      case '-z|-y':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wXLine, angle);
        break;
      case 'y|z':
      case '-y|-z':
      case 'z|-y':
      case '-z|y':
        rotateMatrix = this.rotateAroundWorldAxis(origin, this.wXLine, -angle);
        break;
      default:
        break;
    }
    for (var i = 0; i < elements.length; i++) {
      elements[i].applyMatrix(rotateMatrix);
    }
  }

  /**
   * 计算转动角度
   */
  getRollAngle(startTouch, moveTouch, rollType) {
    var angle = 0;
    var width = this.main.width;
    switch (rollType) {
      case 'x|z': // 在 z 平面向 x 轴正方向滑动
      case 'z|-x':
      case '-x|-z':
      case '-z|x':
        angle = (moveTouch.clientX - startTouch.clientX) / width * 180;
        break;
      case '-x|z':
      case '-z|-x':
      case 'x|-z':
      case 'z|x':
        angle = (startTouch.clientX - moveTouch.clientX) / width * 180;
        break;
      case '-y|z':
      case '-y|-x':
      case '-y|-z':
      case '-y|x':
        angle = (moveTouch.clientY - startTouch.clientY) / width * 180;
        break;
      case 'y|z':
      case 'y|-x':
      case 'y|-z':
      case 'y|x':
        angle = (startTouch.clientY - moveTouch.clientY) / width * 180;
        break;
      case 'z|y':
      case '-x|-y': 
        var u = new THREE.Vector2(moveTouch.clientX - startTouch.clientX, startTouch.clientY - moveTouch.clientY);
        var v = new THREE.Vector2(2, -1);
        angle = u.dot(v) / v.length() / width * 180;
        break;
      case '-z|y':
      case 'x|-y':
        var u = new THREE.Vector2(moveTouch.clientX - startTouch.clientX, startTouch.clientY - moveTouch.clientY);
        var v = new THREE.Vector2(-2, 1);
        angle = u.dot(v) / v.length() / width * 180;
        break;
      case 'x|y':
      case '-z|-y':
        var u = new THREE.Vector2(moveTouch.clientX - startTouch.clientX, startTouch.clientY - moveTouch.clientY);
        var v = new THREE.Vector2(2, 1);
        angle = u.dot(v) / v.length() / width * 180;
        break;
      case '-x|y':
      case 'z|-y':
        var u = new THREE.Vector2(moveTouch.clientX - startTouch.clientX, startTouch.clientY - moveTouch.clientY);
        var v = new THREE.Vector2(-2, -1);
        angle = u.dot(v) / v.length() / width * 180;
        break;
    }
    return (angle - this.rollAngle);
  }
}