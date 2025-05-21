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

        this.black = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x000000),
            side: THREE.DoubleSide,
            transparent: false
        });

        this.glitch = new THREE.MeshBasicMaterial({
            color: 0xFFD84D,
            transparent: true,
        })

        this.ship = new THREE.MeshBasicMaterial({
            map: this.textures.ship,
            transparent: true,
            side: THREE.DoubleSide
        })

    }
}