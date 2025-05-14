import * as THREE from 'three'

import Experience02 from '../Experience02.js'


export default class Textures
{
    constructor()
    {
        this.experience = new Experience02()
        this.loader = this.experience.loaders

    }
}