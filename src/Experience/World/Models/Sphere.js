import * as THREE from "three"

import Experience from "../../Experience.js"

import Lines from "../../Utils/Lines.js"






export default class Sphere
{
    constructor()
    {

        this.experience = new Experience()
        this.lines = new Lines()
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.radius = 14



        this.geometry = new THREE.SphereGeometry(this.radius, 100, 40)
        this.instance = new THREE.Group()


        /** ADD EDGE STROKES */
        this.instance = this.lines.draw({
            geometry: this.geometry,
            color: 0xFF5500,
            thickness: 0.025
        })
        this.instance.rotation.x = 0.33

        /** ADD FILL */
        this.fill = this.lines.fill(this.geometry, 0xFFFFFF)
        // this.fill.scale.setScalar(0.995)
        this.instance.add(this.fill)

        /** ADD OUTLINE */
        this.outlineThickness = 0.001
        this.outline = this.lines.addOutline(this.geometry, new THREE.Color(0xFF5500), this.outlineThickness)
        this.instance.add(this.outline)


    }


}


