import * as THREE from 'three'

import Experience02 from '../Experience02.js'


export default class Textures
{
    constructor()
    {
        this.experience = new Experience02()
        this.loader = this.experience.loaders

        this.ship = this.loader.textures.load(
            '/img/SHIP ASSET.png'
        )

        this.ship.magFilter = THREE.LinearFilter
        this.ship.minFilter = THREE.LinearMipmapLinearFilter

    }
}