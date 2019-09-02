import * as THREE from '../utils/build/three.module'
import { GLTFLoader } from '../utils/jsm/loaders/GLTFLoader.js';

const AddMan = (scene) => {
  const loader = new GLTFLoader().setPath( './assets/models/gltf/' )
  loader.load( 'qzone.gltf', function (gltf) {

    gltf.scene.traverse( function ( child ) {
      if ( child.isMesh ) {
        // child.material.envMap = envMap
      }
    })

    gltf.scene.position.set(0, 20, 0)
    gltf.scene.scale.x = .02
    gltf.scene.scale.y = .02
    gltf.scene.scale.z = .02

    scene.add( gltf.scene )
  })
}

export default AddMan 


