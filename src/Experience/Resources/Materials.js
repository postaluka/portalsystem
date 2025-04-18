import * as THREE from 'three'

import Textures from './Texture'

export default class Materials
{
    constructor()
    {
        this.textures = new Textures()

        this.basic = new THREE.MeshBasicMaterial({
            color: "red"
        })

    }
}