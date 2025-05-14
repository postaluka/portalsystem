import * as THREE from "three"

import Experience02 from "../../Experience.js"

import Lines from "../../Utils/Lines.js"





export default class Torus
{
    constructor()
    {

        this.experience = new Experience02()
        this.lines = new Lines()
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.side = 1.5



        this.geometry = new THREE.TorusGeometry(this.side * 1.5, this.side * 1.5 / 2, 8, 8)



        /** OUTLINES */

        this.instance = this.lines.draw({
            geometry: this.geometry,
            color: 0x000000,
            thickness: 0.05
        })

        this.fill = this.lines.fill(this.geometry)
        this.instance.add(this.fill)


        this.instance.position.x = 7


    }

}


