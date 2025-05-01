
import Experience from './Experience/Experience'


const model = function ()
{


}

export default model;

/**
* Canvas
*/
const canvas = document.querySelector('canvas.webgl')

const introPlanet = document.querySelector('.section.is--intro-section')

/**
* Experience
*/
const experience = new Experience(canvas)


