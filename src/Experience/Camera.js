import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


import Experience02 from './Experience02'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience02()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControl()

        this.debug()

    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(
            0,
            19,
            30
        )
        this.instance.rotation.set(
            0,
            0,
            0
        )
        this.scene.add(this.instance)

    }

    setControl()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI / 2.1
        this.controls.minPolarAngle = Math.PI / 2
        this.controls.minAzimuthAngle = -Math.PI / 4
        this.controls.maxAzimuthAngle = Math.PI / 4
        this.controls.enableZoom = false
        // this.controls.minDistance = 15
        // this.controls.maxDistance = 21
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null, //THREE.MOUSE.DOLLY,
            RIGHT: null //THREE.MOUSE.PAN
        }

        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: null // pinch gestures = off
        }

        this.canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false })


        this.targetCenter = new THREE.Vector3(0, 19, 0)
        this.controls.target.copy(this.targetCenter)
        this.controls.update()
    }


    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setCameraPosition()
    {
        this.cameraFunctions = {
            cameraScene: () =>
            {
                this.instance.position.set(0, 19, 30)
            },

            cameraGlobal: () =>
            {
                this.instance.position.set(0, 0, 100)
            }
        }

    }

    debug()
    {
        this.setCameraPosition()

        this.debug = this.experience.debug
        if (this.debug.active)
        {
            this.debug.cameraFolder.add(this.cameraFunctions, 'cameraScene').name('cameraScene')
            this.debug.cameraFolder.add(this.cameraFunctions, 'cameraGlobal').name('cameraGlobal')
        }
    }

    update()
    {
        this.controls.update()
        // console.log(
        //     this.instance.position,
        //     this.instance.rotation
        // );
    }
}