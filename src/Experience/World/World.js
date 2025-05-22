import * as THREE from 'three'
import gsap from 'gsap'


import PARAMS from '../Utils/PARAMS.js';
import Experience02 from "../Experience02.js";

import Sphere from './Models/Sphere.js';
import Orbits from './Models/Orbits.js';
import Rectangles from './Models/Rectangles.js';
import Labels from './Models/Labels.js';
import Satellites from './Models/Satellites.js';

import { MeshLineGeometry, MeshLineMaterial } from 'meshline';



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
            this.sphere.outlineLine,
            this.sphere.moon,
            this.sphere.moonFill
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
            this.rectangles.black02,
            this.rectangles.black03,
            // this.rectangles.black04,

        )

        /** SATELLITES */

        this.satellites = new Satellites()

        this.orbits.leoBlack.add(
            this.satellites.leo
        )

        this.orbits.meo.add(this.satellites.meo)
        this.satellites.meo.lookAt(this.camera.position)

        this.orbits.geo.add(this.satellites.geo)
        this.satellites.geo.lookAt(this.camera.position)


        this.orbits.meoDashed.add(this.satellites.meoDashed)
        this.satellites.meoDashed.lookAt(this.camera.position)

        this.orbits.geoDashed.add(this.satellites.geoDashed)
        this.satellites.geoDashed.lookAt(this.camera.position)

        /** MOON LINE */

        // Створюємо криву
        const start = new THREE.Vector3(22, 10, 0)       // Початкова точка праворуч
        const control1 = new THREE.Vector3(20, 20, -20)    // Точка контролю (вигин вгору)
        const control2 = new THREE.Vector3(-15, 25, 0)    // Точка контролю (вигин вгору)
        const end = new THREE.Vector3(0, 35, -50)          // Центр сфери

        // Cubic крива
        const curve = new THREE.CubicBezierCurve3(start, control1, control2, end)
        const points = curve.getPoints(50) // більш плавна

        // Створюємо geometry через meshline
        const geometry = new MeshLineGeometry()
        geometry.setPoints(points)

        // Матеріал із кастомним товщиною
        const material = new MeshLineMaterial({
            color: new THREE.Color(0x333333),
            lineWidth: 0.1, // товщина у world space
            transparent: true,
            opacity: 0.85,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        })

        const moonLine = new THREE.Mesh(geometry, material)
        this.scene.add(moonLine)

        const createHelperPoint = (position, color = 0xff0000) =>
        {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8)
            const material = new THREE.MeshBasicMaterial({ color })
            const point = new THREE.Mesh(geometry, material)
            point.position.copy(position)
            this.scene.add(point)
            return point
        }

        /*
        const p0 = createHelperPoint(start, 'red')     // початок
        const p1 = createHelperPoint(control1, 'green')   // контрольна
        const p2 = createHelperPoint(control2, 'green')   // контрольна
        const p3 = createHelperPoint(end, 'blue')       // кінець
        */

        this.moonProgress = 0

        this.scene.add(this.satellites.leoMoon)

        this.moonCurve = new THREE.CubicBezierCurve3(start, control1, control2, end)

        /** MOON ARROWS */

        this.moonArrows = []

        const totalArrows = 9

        for (let i = 0; i < totalArrows; i++)
        {
            const arrow = new THREE.Mesh(
                this.rectangles.arrowGeometry.clone(),
                this.rectangles.material.clone()
            )
            arrow.scale.setScalar(0.1)
            arrow.rotation.z = Math.PI
            this.scene.add(arrow)

            this.moonArrows.push({
                mesh: arrow,
                progress: i * (1 / totalArrows), // рівномірно розкидані по кривій
                speed: 0.00005  // трохи різні швидкості
            })
        }

        /** LABELS */

        this.labels = new Labels()
        this.rectangles.leo.add(this.labels.leo)
        this.rectangles.meo.add(this.labels.meo)
        this.rectangles.geo.add(this.labels.geo)
        this.satellites.leoMoon.add(
            this.labels.leoMoonText
        )







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
        this.satellites.update(
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

        /** MOON CURVE */

        this.moonProgress += this.time.delta * 0.00005

        if (this.moonProgress > 1) this.moonProgress = 0

        const pos = this.moonCurve.getPoint(this.moonProgress)
        this.satellites.leoMoon.position.copy(pos)

        this.satellites.leoMoon.lookAt(this.camera.position)

        /** MOON ARROWS */

        for (const arrow of this.moonArrows)
        {
            arrow.progress += this.time.delta * arrow.speed * 0.5
            if (arrow.progress > 1) arrow.progress = 0

            const pos = this.moonCurve.getPoint(arrow.progress + 0.1)

            arrow.mesh.position.copy(pos)

            const tangent = this.moonCurve.getTangent(arrow.progress)
            const target = pos.clone().add(tangent)
            arrow.mesh.lookAt(target)
            arrow.mesh.rotateZ(Math.PI / 2)
            arrow.mesh.rotateX(Math.PI / 2)
        }



    }

    debug()
    {

        this.debug = this.experience.debug
        if (this.debug.active)
        {


        }
    }
}


