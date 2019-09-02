import * as THREE from '../utils/build/three.module'
import { SceneUtils } from '../utils/jsm/utils/SceneUtils';

const AddEarth = (scene) => {
  //创建地球
  const earth_sphereGeometry = new THREE.SphereGeometry(15,40,40)
  const texture = THREE.ImageUtils.loadTexture("./assets/img/earth4.jpg")
  const normalTexture = THREE.ImageUtils.loadTexture("./assets/img/earth_bump.jpg")
  const specTexture = THREE.ImageUtils.loadTexture("./assets/img/earth_spec.jpg")

  //材质 对光照有反应的 材质 （材质有3种）
  const material = new THREE.MeshPhongMaterial({ 
    map:texture ,
    bumpMap: normalTexture ,
    bumpScale : .5,
    specularMap : specTexture,
    specular : new THREE.Color( 0xff0000 ),
    shininess : 1
  })

  const earth = new SceneUtils.createMultiMaterialObject(earth_sphereGeometry, [material])
  scene.add(earth)
    
  //创建大气层
  const cloud_sphereGeometry = new THREE.SphereGeometry(15.5,40,40)
  const cloudTexture = THREE.ImageUtils.loadTexture("./assets/img/earth_cloud.png")

  const cloudMaterial = new THREE.MeshPhongMaterial({ 
    map:cloudTexture ,
    transparent : true ,
    opacity : 1,
    color :  '#ffffff' ,
    blending : THREE.AdditiveBlending
  })

  const cloud = new SceneUtils.createMultiMaterialObject(cloud_sphereGeometry, [cloudMaterial])
  scene.add(cloud)
}

export default AddEarth 


