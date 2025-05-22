import { Text } from 'troika-three-text'
import * as THREE from "three"

export default class Labels
{
  constructor()
  {
    this.leo = this.create("LEO")
    this.meo = this.create("MEO")
    this.geo = this.create("GEO")

    this.leoMoonText = new THREE.Group()

    this.leoMoon1 = new Text()
    this.leoMoon1.text = 'MIS'
    this.leoMoon1.fontSize = 0.05
    this.leoMoon1.color = 0x050505
    this.leoMoon1.anchorX = 'center'
    this.leoMoon1.anchorY = 'middle'
    this.leoMoon1.position.set(0, 0.35, 0) // трохи над квадратом
    this.leoMoon1.letterSpacing = 0.2
    this.leoMoon1.sync() // обовʼязково!

    this.leoMoon2 = new Text()
    this.leoMoon2.text = "LEO to MEO in 3 Hours"
    this.leoMoon2.fontSize = 0.05
    this.leoMoon2.color = 0x050505
    this.leoMoon2.anchorX = 'center'
    this.leoMoon2.anchorY = 'middle'
    this.leoMoon2.position.set(0, 0.35, 0) // трохи над квадратом
    this.leoMoon2.letterSpacing = 0.2
    this.leoMoon2.sync() // обовʼязково!

    // ⚠ Параметри
    this.bgColor = 0xFFD84D

    this.bg1 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.15, 0.07),
      new THREE.MeshBasicMaterial({ color: this.bgColor })
    )
    this.bg1.position.z = -0.1

    this.leoMoon1.add(this.bg1)

    this.bg2 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.07),
      new THREE.MeshBasicMaterial({ color: this.bgColor })
    )
    this.bg2.position.z = -0.1

    this.leoMoon2.add(this.bg2)

    this.leoMoonText.add(
      this.leoMoon1,
      this.leoMoon2
    )

    this.leoMoonText.position.x = -0.5
    this.leoMoonText.position.y = 0.2

    this.leoMoon1.position.y = 0
    this.leoMoon2.position.y = -0.1

  }

  create(text)
  {
    const label = new Text()
    label.text = text
    label.fontSize = 0.3
    label.color = 0x050505
    label.anchorX = 'center'
    label.anchorY = 'middle'
    label.position.set(0, 0.35, 0) // трохи над квадратом
    label.letterSpacing = 0.6
    label.sync() // обовʼязково!
    return label
  }
}