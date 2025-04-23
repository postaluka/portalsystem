import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

export default class Loaders
{
    constructor()
    {
        this.textures = new THREE.TextureLoader()
        this.cube = new THREE.CubeTextureLoader()

        this.gltfLoader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()

        this.dracoLoader.setDecoderPath('/draco/')

        this.gltfLoader.setDRACOLoader(this.dracoLoader)

        this.font = new FontLoader()

        console.log(this.font);



    }
}