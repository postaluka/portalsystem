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
        this.side = 0.5



        this.geometry = new THREE.SphereGeometry(this.side, 8, 4)
        this.instance = new THREE.Group()


        /** OUTLINES */

        this.instance = this.lines.draw({
            geometry: this.geometry,
            color: 0x000000,
            thickness: 0.05
        })

        this.fill = this.lines.fill(this.geometry, 0xFF5500)
        this.instance.add(this.fill)


        this.instance.position.x = 7


    }

}


