import * as THREE from 'three'
import gsap from 'gsap'


import PARAMS from '../Utils/PARAMS.js';
import Experience02 from "../Experience02.js";

import Cube from './Models/Cube.js';
import Sphere from './Models/Sphere.js';
import RandomPlanes from './Models/RandomPlanes.js';

import { MeshLineGeometry, MeshLineMaterial } from 'meshline';



export default class World
{
    constructor()
    {
        // this.PARAMS = {
        //     rotationScene: 0
        // }

        this.PARAMS = PARAMS

        this.experience = new Experience02()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance

        this.cube = new Cube()
        this.sphere = new Sphere()


        this.randomPlanes = new RandomPlanes(this.sphere.radius)

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


        // Add models
        // this.parallaxGroup.add(

        //     this.randomPlanes.instance
        // )

        this.setCursor()

        this.debug()


        // Функція створення однієї орбіти
        function createOrbit(
            radius = 2,
            width = 0.1,
            opacity = 0.2,
            positionY = 10,
            segments = 128
        )
        {
            const points = []

            // Малюємо тільки півколо (0 → Math.PI) або трохи більше
            for (let i = 0; i <= segments; i++)
            {
                const angle = (i / segments) * Math.PI * 2
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                points.push(new THREE.Vector3(x, y, 0))
            }

            const geometry = new MeshLineGeometry()
            geometry.setPoints(points)

            const material = new MeshLineMaterial({
                color: new THREE.Color(0x050505),
                lineWidth: width,
                transparent: true,
                opacity: opacity,
                resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotation.x = Math.PI / 2 + 0.33
            mesh.position.y = positionY

            return mesh
        }

        const orbit1 = createOrbit(
            14, //radius
            0.1, //width
            0.2, //opacity
            10, //position.y
            128 //segments
        )

        const orbit2 = createOrbit(
            20, //radius
            0.1, //width
            0.12, //opacity
            10, //position.y
            128 //segments
        )

        const orbit3 = createOrbit(
            26, //radius
            0.1, //width
            0.08, //opacity
            10, //position.y
            128 //segments
        )

        this.scene.add(orbit1, orbit2, orbit3)

        function createDashedOrbit(
            radius = 15.5,
            width = 0.1,
            opacity = 1.0,
            positionY = 10,
            segments = 128
        )
        {
            const points = []

            for (let i = 0; i <= segments; i++)
            {
                const angle = (i / segments) * Math.PI / 1.25
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                points.push(new THREE.Vector3(x, y, 0))
            }

            const geometry = new MeshLineGeometry()
            geometry.setPoints(points)

            const material = new MeshLineMaterial({
                color: new THREE.Color(0x444444),
                lineWidth: width,
                transparent: true,
                opacity: opacity,
                resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),

                // Dash settings
                dashArray: 0.01,    // загальна довжина штриха + пропуску (від 0 до 1)
                dashRatio: 0.6,    // співвідношення штриха до прогалини (0.5 = 50/50)
                dashOffset: 0.0,   // можна анімувати
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.y = positionY
            mesh.position.y = 12.2
            mesh.rotation.x = Math.PI / 2 + 0.25
            mesh.rotation.y = - Math.PI * 0.02
            mesh.rotation.z = - Math.PI / 1.375


            return mesh
        }

        const dashedOrbit = createDashedOrbit()
        this.scene.add(dashedOrbit)

        const rectGeometry = new THREE.PlaneGeometry(0.18, 0.18)
        const rectMaterial = new THREE.MeshBasicMaterial({
            color: 0x050505,
            side: THREE.DoubleSide,
            transparent: true,
        })
        const rectLeo = new THREE.Mesh(rectGeometry, rectMaterial)
        orbit1.add(rectLeo)
        const angle = - Math.PI / 2
        const radius = 14
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        rectLeo.position.set(x, y, 0) // Z тут = 0 бо в системі orbit1
        rectLeo.lookAt(this.camera.position)
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

    }

    debug()
    {

        this.debug = this.experience.debug
        if (this.debug.active)
        {
            this.experience.time.setFunctions()

            this.debug.playFolder.add(this.experience.time.functions, 'play')
            this.debug.playFolder.add(this.experience.time.functions, 'pause')

            this.debug.sceneFolder.add(this.PARAMS, 'rotationScene').name('Scene rotation').min(0).max(Math.PI / 2).step(0.1).onChange((value) =>
            {
                this.sphere.instance.rotation.y += value
                this.randomPlanes.instance.rotation.y += value
            })

            this.debug.templateFolder.add({
                export: () =>
                {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.PARAMS, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "params.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                }
            }, 'export').name('💾 Export JSON')

            this.debug.templateFolder.add({
                import: () =>
                {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (event) =>
                    {
                        const file = event.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (e) =>
                        {
                            try
                            {
                                const imported = JSON.parse(e.target.result);
                                Object.assign(this.PARAMS, imported);
                                this.randomPlanes.resetPlanes(); // 🔁 одразу оновити
                                console.log('✅ PARAMS imported', this.PARAMS);
                            }
                            catch (err)
                            {
                                console.error('❌ Error importing PARAMS:', err);
                            }
                        }
                        reader.readAsText(file);
                    }
                    input.click();
                }
            }, 'import').name('📂 Import JSON')

        }
    }
}


