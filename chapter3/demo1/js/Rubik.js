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
  }

  model(type) {
    //创建集合
    this.group = new THREE.Group();
    this.group.childType = type;

    //生成小方块
    this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors);
    for (var i = 0; i < this.cubes.length; i++) {
      var item = this.cubes[i];
      //小方块不再直接加入场景了，而是先加入集合，然后再把集合加入场景。
      //this.main.scene.add(item);
      this.group.add(item);
    }

    //外层透明容器
    var width = BasicParams.num * BasicParams.len;
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
}