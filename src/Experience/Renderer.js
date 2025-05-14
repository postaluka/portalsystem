import * as THREE from 'three'

import Experience02 from "./Experience02";
import World from './World/World';

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience02()
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
            preserveDrawingBuffer: true // ОБОВʼЯЗКОВО для saveFrame!
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRation, 2)) //треба 2, 0.5 для оптимізації 

        // this.instance.shadowMap.enabled = true

    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRation, 2)) //треба 2, 0.5 для оптимізації 
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }

    saveFrame()
    {
        const canvas = this.instance.domElement;
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'frame.png';
        link.href = dataURL;
        link.click();
    }

    savePng()
    {
        this.update()
        this.saveFrame()
    }
}