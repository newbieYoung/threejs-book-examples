import './css/index.css';
import * as THREE from './utils/build/three.module';
import { OrbitControls } from './utils/jsm/controls/OrbitControls.js';
import addLights from './components/AddLights'; //灯光
import addEarth from './components/AddEarth'; //地球
import addMan from './components/AddMan'; //宇航员

//项目初始化
app()
function app(){
	
	let camera, scene, renderer, controls

	const init = () => {	
		//环境初始化
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.z = 70
		scene = new THREE.Scene()

		//添加灯光
		addLights(scene)

		//添加地球
		addEarth(scene)

		//添加宇航员
		addMan(scene)

		renderer = new THREE.WebGLRenderer({ 
			alpha: true,
			antialias: true 
		})
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		
		//添加旋转控制器
		controls = new OrbitControls( camera, renderer.domElement );
		controls.rotateSpeed = .4

		document.body.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
	}

	//不停地渲染
	const animate = () => {
		window.requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
	}

	//响应式
	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	//render渲染内容
	init()
	animate()

}