import * as THREE from 'three'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

export default class Orbits
{
  constructor()
  {

    /** ORBITS */

    this.leo = this.create(
      14, //radius
      0.1, //width
      0.2, //opacity
      10, //position.y
      128, //segments
      Math.PI * 2, // angleCircle
    )

    this.meo = this.create(
      20, //radius
      0.1, //width
      0.12, //opacity
      10, //position.y
      128, //segments
      Math.PI * 2, // angleCircle
    )

    this.geo = this.create(
      26, //radius
      0.1, //width
      0.08, //opacity
      10, //position.y
      128, //segments
      Math.PI * 2, // angleCircle
    )

    this.leoBlack = this.create(
      14, //radius
      0.1, //width
      1, //opacity
      10, //position.y
      128, //segments
      -Math.PI / 1.9, // angleCircle
    )
    // blackLeoOrbit.rotation.x = Math.PI / 2 + 0.34
    this.leoBlack.rotation.y = -0.025
    this.leoBlack.rotation.z = Math.PI * 1.5

    /** DASHES */

    this.meoDashed = this.createDashed(
      15.5, //radius
      0.1, //width
      0.5, //opacity
      128, //segments
      Math.PI / 1.25, //angle
      0.006, //dashArray
      0.6 //dashRatio
    )
    this.meoDashed.position.y = 12.2
    this.meoDashed.rotation.x = Math.PI / 2 + 0.25
    this.meoDashed.rotation.y = - Math.PI * 0.02
    this.meoDashed.rotation.z = - Math.PI / 1.375

    this.geoDashed = this.createDashed(
      20, //radius
      0.1, //width
      0.5, //opacity
      128, //segments
      Math.PI / 1.9, //angle
      0.007, //dashArray
      0.6 //dashRatio
    )
    this.geoDashed.position.y = 12.4
    this.geoDashed.rotation.x = - Math.PI / 2 + 0.32
    this.geoDashed.rotation.y = - Math.PI * 0.025
    this.geoDashed.rotation.z = Math.PI / 1.87

  }

  create(
    radius = 2,
    width = 0.1,
    opacity = 0.2,
    positionY = 10,
    segments = 128,
    angleCircle = Math.PI * 2
  )
  {
    const points = []

    // Малюємо тільки півколо (0 → Math.PI) або трохи більше
    for (let i = 0; i <= segments; i++)
    {
      const angle = (i / segments) * angleCircle
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push(new THREE.Vector3(x, y, 0))
    }

    const geometry = new MeshLineGeometry()
    geometry.setPoints(points)

    const material = new MeshLineMaterial({
      color: new THREE.Color(0x050505),
      lineWidth: width,
      transparent: true,
      opacity: opacity,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2 + 0.33
    mesh.position.y = positionY

    return mesh
  }

  createDashed(
    radius = 15.5,
    width = 0.1,
    opacity = 0.5,
    segments = 128,
    angleCircle = Math.PI / 1.25,
    dashArray = 0.005,
    dashRatio = 0.6
  )
  {
    const points = []

    for (let i = 0; i <= segments; i++)
    {
      const angle = (i / segments) * angleCircle
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push(new THREE.Vector3(x, y, 0))
    }

    const geometry = new MeshLineGeometry()
    geometry.setPoints(points)

    const material = new MeshLineMaterial({
      color: new THREE.Color(0x444444),
      lineWidth: width,
      transparent: true,
      opacity: opacity,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),

      // Dash settings
      dashArray: dashArray,    // загальна довжина штриха + пропуску (від 0 до 1)
      dashRatio: dashRatio,    // співвідношення штриха до прогалини (0.5 = 50/50)
      dashOffset: 0.0,   // можна анімувати
    })

    const mesh = new THREE.Mesh(geometry, material)

    return mesh
  }

}



