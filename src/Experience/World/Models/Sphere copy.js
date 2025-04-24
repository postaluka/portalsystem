import * as THREE from "three"

import Experience from "../../Experience.js"

import Lines from "../../Utils/Lines.js"
import { value } from "canvas-sketch-util/random.js"


export default class Sphere
{
    constructor()
    {

        this.PARAMS = {
            stroke: 0.025,
            outline: 0.001
        }

        this.experience = new Experience()
        this.lines = new Lines()
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.radius = 14

        this.geometry = new THREE.SphereGeometry(this.radius, 100, 40)
        this.instance = new THREE.Group()


        /** ADD EDGE STROKES */
        this.addEdgeStroke()

        /** ADD FILL */
        this.fill = this.lines.fill(this.geometry, 0xFFFFFF)
        // this.fill.scale.setScalar(0.995)
        this.instance.add(this.fill)

        /** ADD OUTLINE */
        this.outlineThickness = this.PARAMS.outline
        this.outline = this.lines.addOutline(this.geometry, new THREE.Color(0xFF5500), this.outlineThickness)
        this.instance.add(this.outline)

        this.debug()

    }

    addEdgeStroke()
    {
        this.instance = this.lines.draw({
            geometry: this.geometry,
            color: 0xFF5500,
            thickness: this.PARAMS.stroke
        })
        this.instance.rotation.x = 0.33
    }

    debug()
    {
        this.debug = this.experience.debug

        if (this.debug.active)
        {
            this.debug.sphereFolder.add(this.PARAMS, 'stroke').min(0.01).max(0.1).step(0.001).onFinishChange((value) =>
            {
                this.addEdgeStroke()
            })
        }
    }


}


