import * as THREE from "three"

import Experience from "../../Experience.js"

import Lines from "../../Utils/Lines.js"
import PARAMS from "../../Utils/PARAMS.js"



export default class Sphere
{
    constructor()
    {

        // this.PARAMS = {
        //     stroke: 0.025,
        //     outline: 0.001,
        //     stepWidth: 2,
        //     longSteps: 12,
        //     widthSegments: 100,
        //     heightSegments: 40
        // }

        this.PARAMS = PARAMS

        this.experience = new Experience()
        this.lines = new Lines(this.PARAMS.stepWidth)
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.radius = 14

        this.geometry = new THREE.SphereGeometry(this.radius, this.PARAMS.widthSegments, this.PARAMS.heightSegments)
        this.geometryOutline = new THREE.SphereGeometry(this.radius, 100, 100)
        this.instance = new THREE.Group()


        /** ADD EDGE STROKES */
        this.addEdgeStroke()

        /** ADD FILL */
        this.addFill()

        /** ADD OUTLINE */
        this.addOutline()

        this.debug()

    }

    addEdgeStroke()
    {
        if (this.edgeLines)
        {
            this.instance.remove(this.edgeLines)
            this.edgeLines.geometry.dispose()
            this.edgeLines.material.dispose()
        }

        this.edgeLines = this.lines.draw({
            geometry: this.geometry,
            color: 0x3E78FF,
            thickness: this.PARAMS.stroke,
            stepWidth: this.PARAMS.stepWidth,
            longSteps: this.PARAMS.longSteps
        })

        this.instance.add(this.edgeLines)
        this.instance.rotation.x = 0 //0.33

        this.outlineLine = this.lines.drawOutlineCircle({
            radius: this.radius * 1.001, // трохи більший, щоб був "поверх"
            thickness: this.PARAMS.stroke * 1.2,
            color: 0x3E78FF
        })
        this.outlineLine.rotation.x = -0.1
        // this.instance.add(outlineLine)



    }

    addFill()
    {
        this.fill = this.lines.fill(this.geometry, 0xE7E6E3)
        this.instance.add(this.fill)
    }

    addOutline()
    {
        this.outlineThickness = this.PARAMS.outline
        this.outline = this.lines.addOutline(this.geometryOutline, new THREE.Color(0x3E78FF), this.outlineThickness)
        this.instance.add(this.outline)
    }

    updateGeometry()
    {
        // Видаляємо попередні елементи
        this.instance.clear()
        this.geometry.dispose()

        // Генеруємо нову геометрію з новими параметрами
        this.geometry = new THREE.SphereGeometry(
            this.radius,
            this.PARAMS.widthSegments,
            this.PARAMS.heightSegments
        )

        // Додаємо всі заново
        this.addEdgeStroke()
        this.addFill()
        this.addOutline()
    }

    debug()
    {
        this.debug = this.experience.debug

        if (this.debug.active)
        {
            this.debug.sphereFolder.add(this.PARAMS, 'stroke').min(0.01).max(0.1).step(0.001).onChange((value) =>
            {
                this.addEdgeStroke()
            })

            this.debug.sphereFolder.add(this.PARAMS, 'outline').min(0).max(0.1).step(0.0001).onChange((value) =>
            {
                this.instance.remove(this.outline)
                this.outline.geometry.dispose()
                this.outline.material.dispose()
                this.addOutline()
            })

            // this.debug.sphereFolder.add(this.PARAMS, 'widthSegments').min(4).max(200).step(1).onChange(() =>
            // {
            //     this.updateGeometry()
            // })

            this.debug.sphereFolder.add(this.PARAMS, 'heightSegments').min(4).max(100).step(1).onChange(() =>
            {
                this.updateGeometry()
            })

            this.debug.sphereFolder.add(this.PARAMS, 'stepWidth').min(1).max(10).step(1).onChange((value) =>
            {
                this.addEdgeStroke()
            })

            this.debug.sphereFolder.add(this.PARAMS, 'longSteps').min(2).max(32).step(1).name('heights').onChange(() =>
            {
                this.addEdgeStroke()
            })
        }
    }


}


