import * as THREE from 'three'

import Experience from "./Experience";
import World from './World/World';

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRation, 1)) //треба 2, 0.5 для оптимізації 

        this.instance.shadowMap.enabled = true

    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRation, 1)) //треба 2, 0.5 для оптимізації 
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}