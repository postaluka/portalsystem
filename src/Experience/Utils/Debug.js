import * as dat from 'lil-gui'


export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if (this.active)
        {
            this.ui = new dat.GUI()
            this.playFolder = this.ui.addFolder('Play/Stop')
            this.sceneFolder = this.ui.addFolder('Scene').close()
            this.cameraFolder = this.ui.addFolder('Camera').close()
            this.randomPlanesFolder = this.ui.addFolder('Random Planes').close()
            this.sphereFolder = this.ui.addFolder('Sphere').close()
            this.templateFolder = this.ui.addFolder("Template").close()
        }
    }

} 