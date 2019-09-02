import * as THREE from '../utils/build/three.module'

const AddLights = (scene) => {
  //环境光
  let ambientLight = new THREE.AmbientLight(0xffffff)
  ambientLight.intensity = .88
  scene.add(ambientLight)

  //平行光
  let light = new THREE.DirectionalLight( 0xffffff )
  light.position.set( 50, 200, 100 )
  light.castShadow = true
  light.shadow.camera.top = 180
  light.shadow.camera.bottom = -100
  light.shadow.camera.left = -120
  light.shadow.camera.right = 120
  light.intensity = .5
  light = light
  scene.add( light )
}

export default AddLights 


