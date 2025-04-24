import * as dat from 'lil-gui'

import Experience from '../Experience'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if (this.active)
        {
            this.ui = new dat.GUI()
            this.cameraFolder = this.ui.addFolder('Camera')
            this.randomPlanesFolder = this.ui.addFolder('Random Planes')
        }
    }

} 