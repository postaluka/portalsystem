import * as THREE from 'three'

import Debug from './Utils/Debug';
import Loaders from './Utils/Loaders';

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';

import Textures from './Resources/Texture';
import Materials from './Resources/Materials';

let instance = null

export default class Experience
{
    constructor(canvas)
    {

        // Singleton
        if (instance)
        {
            return instance
        }
        instance = this

        this.canvas = canvas

        this.debug = new Debug()
        this.loaders = new Loaders()


        this.textures = new Textures()
        this.materials = new Materials()

        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()

        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.axesHelper = new THREE.AxesHelper(5)
        this.scene.add(this.axesHelper)


        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.time.on('tick', () =>
        {
            this.update()
        })


    }


    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
        this.world.update()
    }
}




