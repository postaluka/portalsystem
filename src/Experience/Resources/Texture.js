import * as THREE from 'three'

import Experience from '../Experience.js'


export default class Textures
{
    constructor()
    {
        this.experience = new Experience()
        this.loader = this.experience.loaders

    }
}