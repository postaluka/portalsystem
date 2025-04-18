import * as THREE from 'three'


import Experience from "../Experience.js";

import Lights from './Lights.js';

import Cube from './Models/Cube.js';
import Torus from './Models/Torus.js';



export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene

        this.lights = new Lights()

        this.cube = new Cube()
        this.torus = new Torus()



        // Add lights
        this.scene.add(
            this.lights.directional,
            // this.lights.directionalHelper,
            // this.lights.directionalCameraHelper,
        )

        // Add models
        this.scene.add(

            this.cube.instance,
            this.torus.instance
            // this.space.instance




        )


    }

    update()
    {
        this.cube.instance.rotation.x += this.time.delta * 0.0005
        this.torus.instance.rotation.x -= this.time.delta * 0.0005
    }
}


