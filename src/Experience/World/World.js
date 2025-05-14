import * as THREE from 'three'
import gsap from 'gsap'


import PARAMS from '../Utils/PARAMS.js';
import Experience02 from "../Experience02.js";

import Sphere from './Models/Sphere.js';


import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Text } from 'troika-three-text'




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
            segments = 128,
            angleCircle = Math.PI * 2
        )
        {
            const points = []

            // Малюємо тільки півколо (0 → Math.PI) або трохи більше
            for (let i = 0; i <= segments; i++)
            {
                const angle = (i / segments) * angleCircle
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

        const orbitLeo = createOrbit(
            14, //radius
            0.1, //width
            0.2, //opacity
            10, //position.y
            128, //segments
            Math.PI * 2, // angleCircle
        )

        const orbitMeo = createOrbit(
            20, //radius
            0.1, //width
            0.12, //opacity
            10, //position.y
            128, //segments
            Math.PI * 2, // angleCircle
        )

        const orbitGeo = createOrbit(
            26, //radius
            0.1, //width
            0.08, //opacity
            10, //position.y
            128, //segments
            Math.PI * 2, // angleCircle
        )

        this.scene.add(orbitLeo, orbitMeo, orbitGeo)

        const blackLeoOrbit = createOrbit(
            14, //radius
            0.1, //width
            1, //opacity
            10, //position.y
            128, //segments
            -Math.PI / 1.9, // angleCircle
        )
        // blackLeoOrbit.rotation.x = Math.PI / 2 + 0.34
        blackLeoOrbit.rotation.y = -0.025
        blackLeoOrbit.rotation.z = Math.PI * 1.5
        this.scene.add(blackLeoOrbit)

        /** DASHED LINES */

        function createDashedOrbit(
            radius = 15.5,
            width = 0.1,
            opacity = 0.5,
            segments = 128,
            angleCircle = Math.PI / 1.25,
            dashArray = 0.005,
            dashRatio = 0.6
        )
        {
            const points = []

            for (let i = 0; i <= segments; i++)
            {
                const angle = (i / segments) * angleCircle
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
                dashArray: dashArray,    // загальна довжина штриха + пропуску (від 0 до 1)
                dashRatio: dashRatio,    // співвідношення штриха до прогалини (0.5 = 50/50)
                dashOffset: 0.0,   // можна анімувати
            })

            const mesh = new THREE.Mesh(geometry, material)

            return mesh
        }

        const dashedMeoOrbit = createDashedOrbit(
            15.5, //radius
            0.1, //width
            0.5, //opacity
            128, //segments
            Math.PI / 1.25, //angle
            0.005, //dashArray
            0.6 //dashRatio
        )
        dashedMeoOrbit.position.y = 12.2
        dashedMeoOrbit.rotation.x = Math.PI / 2 + 0.25
        dashedMeoOrbit.rotation.y = - Math.PI * 0.02
        dashedMeoOrbit.rotation.z = - Math.PI / 1.375
        this.scene.add(dashedMeoOrbit)

        const dashedGeoOrbit = createDashedOrbit(
            20, //radius
            0.1, //width
            0.5, //opacity
            128, //segments
            Math.PI / 2.4, //angle
            0.01, //dashArray
            0.6 //dashRatio
        )
        dashedGeoOrbit.position.y = 12.4
        dashedGeoOrbit.rotation.x = - Math.PI / 2 + 0.32
        dashedGeoOrbit.rotation.y = - Math.PI * 0.025
        dashedGeoOrbit.rotation.z = Math.PI / 1.87
        this.scene.add(dashedGeoOrbit)

        /** RECTANGLES */

        const rectGeometry = new THREE.PlaneGeometry(0.18, 0.18)
        const rectMaterial = new THREE.MeshBasicMaterial({
            color: 0x050505,
            side: THREE.DoubleSide,
            transparent: true,
        })

        const rectLeo = new THREE.Mesh(rectGeometry, rectMaterial)
        orbitLeo.add(rectLeo)
        const rectLeoAngle = - Math.PI / 2
        const rectLeoRadius = 14
        const rectLeoX = Math.cos(rectLeoAngle) * rectLeoRadius
        const rectLeoY = Math.sin(rectLeoAngle) * rectLeoRadius
        rectLeo.position.set(rectLeoX, rectLeoY, 0) // Z тут = 0 бо в системі orbitLeo
        rectLeo.lookAt(this.camera.position)

        const rectMeo = new THREE.Mesh(rectGeometry, rectMaterial)
        orbitMeo.add(rectMeo)
        const rectMeoAngle = - Math.PI / 1.46
        const rectMeoRadius = 20
        const rectMeoX = Math.cos(rectMeoAngle) * rectMeoRadius
        const rectMeoY = Math.sin(rectMeoAngle) * rectMeoRadius
        rectMeo.position.set(rectMeoX, rectMeoY, 0) // Z тут = 0 бо в системі orbitLeo
        rectMeo.lookAt(this.camera.position)
        rectMeo.scale.setScalar(1.1)

        const rectGeo = new THREE.Mesh(rectGeometry, rectMaterial)
        orbitGeo.add(rectGeo)
        const rectGeoAngle = - Math.PI / 1.88
        const rectGeoRadius = 26
        const rectGeoX = Math.cos(rectGeoAngle) * rectGeoRadius
        const rectGeoY = Math.sin(rectGeoAngle) * rectGeoRadius
        rectGeo.position.set(rectGeoX, rectGeoY, 0) // Z тут = 0 бо в системі orbitLeo
        rectGeo.lookAt(this.camera.position)
        rectGeo.scale.setScalar(1.2)

        /** LABELS */

        const labelLeo = new Text()
        labelLeo.text = 'LEO'
        labelLeo.fontSize = 0.3
        labelLeo.color = 0x050505
        labelLeo.anchorX = 'center'
        labelLeo.anchorY = 'middle'
        labelLeo.position.set(0, 0.35, 0) // трохи над квадратом
        labelLeo.letterSpacing = 0.6
        labelLeo.sync() // обовʼязково!
        rectLeo.add(labelLeo)

        const labelMeo = new Text()
        labelMeo.text = 'MEO'
        labelMeo.fontSize = 0.3
        labelMeo.color = 0x050505
        labelMeo.anchorX = 'center'
        labelMeo.anchorY = 'middle'
        labelMeo.position.set(0, 0.35, 0) // трохи над квадратом
        labelMeo.letterSpacing = 0.6
        labelMeo.sync() // обовʼязково!
        rectMeo.add(labelMeo)

        const labelGeo = new Text()
        labelGeo.text = 'GEO'
        labelGeo.fontSize = 0.3
        labelGeo.color = 0x050505
        labelGeo.anchorX = 'center'
        labelGeo.anchorY = 'middle'
        labelGeo.position.set(0, 0.35, 0) // трохи над квадратом
        labelGeo.letterSpacing = 0.6
        labelGeo.sync() // обовʼязково!
        rectGeo.add(labelGeo)
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


