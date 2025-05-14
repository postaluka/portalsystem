import * as THREE from 'three'
import gsap from 'gsap'


import PARAMS from '../Utils/PARAMS.js';
import Experience from "../Experience.js";


import Lights from './Lights.js';

import Cube from './Models/Cube.js';
import Sphere from './Models/Sphere.js';
import RandomPlanes from './Models/RandomPlanes.js';



export default class World
{
    constructor()
    {
        // this.PARAMS = {
        //     rotationScene: 0
        // }

        this.PARAMS = PARAMS

        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes

        this.lights = new Lights()

        this.cube = new Cube()
        this.sphere = new Sphere()


        this.randomPlanes = new RandomPlanes(this.sphere.radius)

        this.rotationScrollGroup = new THREE.Group()
        this.scene.add(
            this.rotationScrollGroup,
            this.sphere.outlineLine
        )

        this.parallaxGroup = new THREE.Group()

        this.rotationScrollGroup.add(this.parallaxGroup, this.sphere.instance)
        this.rotationScrollGroup.rotation.x = 0.33


        // Add models
        this.parallaxGroup.add(

            this.randomPlanes.instance
        )

        this.setCursor()

        this.debug()



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
        this.setParallax()

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
        this.randomPlanes.instance.rotation.y += this.rotationXSpeed
        this.randomPlanes.array.forEach((plane) =>
        {
            const worldPosition = new THREE.Vector3(0, 19, 10000)

            plane.lookAt(worldPosition)

            // plane.lookAt(this.experience.camera.instance.position);

        })


        this.randomPlanes.update()

    }

    debug()
    {

        this.debug = this.experience.debug
        if (this.debug.active)
        {
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


