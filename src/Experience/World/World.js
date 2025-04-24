import * as THREE from 'three'
import gsap from 'gsap'


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
        this.sizes = this.experience.sizes

        this.lights = new Lights()

        this.cube = new Cube()
        this.torus = new Torus()
        this.sphere = new Sphere()
        this.suzanne = new Suzanne()

        this.randomPlanes = new RandomPlanes(this.sphere.radius)

        this.rotationGroup = new THREE.Group()
        this.scene.add(this.rotationGroup)


        // Add models
        this.rotationGroup.add(
            this.sphere.instance,
            this.randomPlanes.instance
        )

        this.setCursor()



    }

    setCursor() 
    {
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0
        window.addEventListener('mousemove', (event) =>
        {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5

        })
    }

    // setParallax()
    // {
    //     this.easing = 0.06

    //     this.parallaxRotationY = this.cursor.x * 0.25

    //     this.rotationGroup.rotation.y += (this.parallaxRotationY - this.rotationGroup.rotation.y) * this.easing


    // }

    setParallax()
    {
        const rotationTarget = this.cursor.x * 0.25
        const positionTarget = - this.cursor.y * 0.25


        gsap.to(this.rotationGroup.rotation, {
            y: rotationTarget,
            duration: 4,
            ease: "back.out(4)",
        })

        gsap.to(this.rotationGroup.position, {
            y: positionTarget,
            duration: 4,
            ease: "back.out(4)",
        })

    }

    update()
    {
        // this.setParallax()

        this.speedOffset = 0.0001
        this.rotationXSpeed = this.time.delta * this.speedOffset
        this.rotationYSpeed = this.time.delta * this.speedOffset

        this.sphere.instance.rotation.y += this.rotationXSpeed

        this.randomPlanes.instance.rotation.y += this.rotationXSpeed
        this.randomPlanes.array.forEach((plane) =>
        {
            const worldPosition = new THREE.Vector3(0, 0, 100)
            // this.experience.camera.instance.getWorldPosition(worldPosition)
            plane.lookAt(worldPosition)
        })




        this.randomPlanes.update()

    }
}


