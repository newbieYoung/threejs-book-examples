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
    this.renderer.setClearColor(0xFFFFFF, 1.0); //设置背景颜色
    this.renderer.setSize(this.width, this.height); //设置渲染器宽度和高度
    this.renderer.setPixelRatio(this.devicePixelRatio); //设置设备像素比
    this.renderer.shadowMapEnabled = true; // 支持阴影
    document.body.appendChild(this.renderer.domElement) //把画布显示到页面中
  }

  //初始化场景
  initScene() {
    this.scene = new THREE.Scene();
    var axes = new THREE.AxesHelper(100); // 坐标轴可视化工具
    this.scene.add(axes);
  }

  //添加相机
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
    this.camera.position.set(200, 400, 600); // 位置
    this.camera.up.set(0, 1, 0); //上方向
    this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 焦点
    this.scene.add(this.camera);
  }

  //添加灯光
  initLight() {
    this.ambientLight = new THREE.AmbientLight(0x666666, 1.0); // 环境光
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff, 1, 2000); //点光源
    this.pointLight.position.set(70, 110, 90);
    this.scene.add(this.pointLight)

    this.pointLight.castShadow = true; // 产生阴影
    this.pointLight.shadow.camera.near = 1; // 定义阴影相机参数
    this.pointLight.shadow.camera.far = 2000;
  }

  //添加物体
  initObject() {
    let box = new THREE.BoxGeometry(100, 100, 100); // 立方体
    let lambert = new THREE.MeshLambertMaterial({ // 兰伯特网格材质
      color: 0xff0000
    });
    this.cube = new THREE.Mesh(box, lambert); // 网格
    this.cube.position.set(-150, 0, 0);
    this.scene.add(this.cube);
    this.cube.castShadow = true; // 产生阴影

    let sphere = new THREE.SphereGeometry(80, 20, 20); // 球体
    let phong = new THREE.MeshPhongMaterial({ // 冯氏网格材质
      color: 0xff0000,
      shininess: 60
    });
    this.ball = new THREE.Mesh(sphere, phong); // 网格
    this.ball.position.set(150, 0, -120);
    this.scene.add(this.ball);
    this.ball.castShadow = true; // 产生阴影

    let plane = new THREE.PlaneGeometry(800, 800); // 平面
    let planeLambert = new THREE.MeshPhongMaterial({
      color: 0xE0E0E0,
    });
    this.floor = new THREE.Mesh(plane, planeLambert);
    this.floor.position.set(0, -70, -60);
    this.floor.rotateX(-Math.PI / 2);
    this.scene.add(this.floor);
    this.floor.receiveShadow = true; // 显示阴影
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