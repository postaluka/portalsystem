import * as THREE from 'three'


import Experience from "../Experience.js";

import Lights from './Lights.js';

import Cube from './Models/Cube.js';
import Torus from './Models/Torus.js';
import Sphere from './Models/Sphere.js';
import Suzanne from './Models/Suzanne.js';
import RandomPlanes from './Models/RandomPlanes.js';



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
        this.sphere = new Sphere()
        this.suzanne = new Suzanne()

        this.randomPlanesCount = 100
        this.randomPlanes = new RandomPlanes(this.sphere.radius, this.randomPlanesCount)



        // Add lights
        this.scene.add(
            this.lights.directional,
            // this.lights.directionalHelper,
            // this.lights.directionalCameraHelper,
        )

        // Add models
        this.scene.add(
            this.sphere.instance,
            this.randomPlanes.instance
        )

        console.log();

    }

    update()
    {
        this.speedOffset = 0.0001
        this.rotationXSpeed = this.time.delta * this.speedOffset
        this.rotationYSpeed = this.time.delta * this.speedOffset

        this.sphere.instance.rotation.x -= this.rotationXSpeed
        this.sphere.instance.rotation.y += this.rotationYSpeed

        this.randomPlanes.instance.rotation.x -= this.rotationXSpeed
        this.randomPlanes.array.forEach((plane) =>
        {
            plane.rotation.x = -this.randomPlanes.instance.rotation.x
        })
        // this.randomPlanes.instance.rotation.y += this.rotationYSpeed

    }
}


