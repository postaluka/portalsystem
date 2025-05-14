import * as THREE from "three"

import Experience from "../../Experience.js"

import Lines from "../../Utils/Lines.js"




export default class Cube
{
    constructor()
    {

        this.experience = new Experience()
        this.lines = new Lines()
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.side = 3

        // Set cube
        this.geometry = new THREE.BoxGeometry(this.side, this.side, this.side)

        /** OUTLINES */

        this.instance = this.lines.draw({
            geometry: this.geometry,
            color: 0x000000,
            thickness: 0.05
        })

        this.fill = this.lines.fill(this.geometry)
        this.instance.add(this.fill)


        this.instance.position.x = -7

    }

    debug()
    {

        // Debug
        this.debug = this.experience.debug
        if (this.debug.active)
        {
            this.debug.ui.add(this.instance.position, 'x', -10, 10, 0.01).name('position.x')
        }
    }
}


