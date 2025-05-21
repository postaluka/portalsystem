import * as THREE from 'three'
import gsap from 'gsap'


import PARAMS from '../Utils/PARAMS.js';
import Experience02 from "../Experience02.js";

import Sphere from './Models/Sphere.js';
import Orbits from './Models/Orbits.js';
import Rectangles from './Models/Rectangles.js';
import Labels from './Models/Labels.js';

import { Text } from 'troika-three-text'




export default class World
{
    constructor()
    {

        this.PARAMS = PARAMS

        this.experience = new Experience02()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance

        this.sphere = new Sphere()

        this.rotationScrollGroup = new THREE.Group()
        this.scene.add(
            this.rotationScrollGroup,
            this.sphere.outlineLine
        )

        this.parallaxGroup = new THREE.Group()

        this.rotationScrollGroup.add(
            this.parallaxGroup,
            this.sphere.instance
        )

        this.rotationScrollGroup.rotation.x = 0.33

        this.setCursor()

        this.debug()

        /** ORBITS */

        this.orbits = new Orbits()

        this.scene.add(
            this.orbits.leo,
            this.orbits.meo,
            this.orbits.geo,
            this.orbits.leoBlack
        )

        /** DASHED LINES */

        this.scene.add(
            this.orbits.meoDashed,
            this.orbits.geoDashed
        )


        /** RECTANGLES */

        this.rectangles = new Rectangles()

        this.orbits.leo.add(this.rectangles.leo)
        this.rectangles.leo.lookAt(this.camera.position)

        this.orbits.meo.add(this.rectangles.meo)
        this.rectangles.meo.lookAt(this.camera.position)

        this.orbits.geo.add(this.rectangles.geo)
        this.rectangles.geo.lookAt(this.camera.position)

        this.orbits.leoBlack.add(
            // this.rectangles.black,
            this.rectangles.black02,
            this.rectangles.black03,
            this.rectangles.black04
        )

        /** SATELLITES */

        this.orbits.meoDashed.add(
            this.rectangles.meoSat
        )
        this.rectangles.meoSat.lookAt(this.camera.position)

        this.orbits.geoDashed.add(
            this.rectangles.geoSat
        )
        this.rectangles.geoSat.lookAt(this.camera.position)

        /** LABELS */

        this.labels = new Labels()
        this.rectangles.leo.add(this.labels.leo)
        this.rectangles.meo.add(this.labels.meo)
        this.rectangles.geo.add(this.labels.geo)

        /** ARROW */
        // this.orbits.leoBlack.add(this.rectangles.arrow)
        // this.rectangles.arrow.lookAt(this.camera.position)




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


    setParallax()
    {
        const rotationTarget = -(this.cursor.y * 0.05) // -(this.cursor.y * 0.025)
        const positionTarget = (this.cursor.x * 0.7) // (this.cursor.x * 0.5)


        gsap.to(this.parallaxGroup.rotation, {
            x: rotationTarget,
            duration: 4,
            ease: "back.out(4)",
        })
        gsap.to(this.parallaxGroup.position, {
            x: positionTarget,
            duration: 4,
            ease: "back.out(4)",
        })


    }

    update()
    {
        // this.setParallax()

        // Встановлюємо затухання (чим менше - тим довше крутиться)
        this.damping = 0.9; // наприклад 0.96
        this.PARAMS.angularVelocity *= this.damping;
        // Обмеження, щоб не було дуже маленьких "вічних" обертань
        if (Math.abs(this.PARAMS.angularVelocity) < 0.000001)
            this.PARAMS.angularVelocity = 0;

        this.speedOffset = 0.0001 //0.0001
        this.multiplierSpeed = this.PARAMS.scrollRotationMultiplier || 1

        this.rotationXSpeed = this.time.delta * this.speedOffset

        //  SCROLL SPEED
        this.rotationXAngularVelocitySpeed = this.PARAMS.angularVelocity
        this.rotationScrollGroup.rotation.y += this.rotationXAngularVelocitySpeed

        // LINEAR ROTATION
        this.sphere.instance.rotation.y += this.rotationXSpeed

        /** SATELLITES */
        this.rectangles.meoSatUpdate(
            this.time.delta,
            this.camera.position
        )
        this.rectangles.geoSatUpdate(
            this.time.delta,
            this.camera.position
        )


        /** ARROWS */
        this.rectangles.blackUpdate02(
            this.time.delta,
            this.camera.position
        )
        this.rectangles.blackUpdate03(
            this.time.delta,
            this.camera.position
        )
        this.rectangles.blackUpdate04(
            this.time.delta,
            this.camera.position
        )



    }

    debug()
    {

        this.debug = this.experience.debug
        if (this.debug.active)
        {


        }
    }
}


