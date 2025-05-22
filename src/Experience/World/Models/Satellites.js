import * as THREE from 'three'

import Experience02 from '../../Experience02'

export default class Satellites
{
  constructor()
  {
    this.experience = new Experience02()
    this.materials = this.experience.materials

    this.geometry = new THREE.PlaneGeometry(0.18, 0.18)

    this.multiplier = 0.0001 //0.0001

    /** MAIN LEO */

    this.leo = new THREE.Mesh(this.geometry, this.materials.ship)
    this.leo.scale.setScalar(7)

    this.leoAngle = -Math.PI * 0.001 // Початковий кут
    this.leoRadius = 14              // Радіус такий самий як в leoBlack

    this.leoMoon = new THREE.Mesh(this.geometry, this.materials.ship)
    this.leoMoon.scale.setScalar(7)

    /** MEO GEO */

    this.meoStatus = 'dashed' // 'line', 'dashed'
    this.geoStatus = 'line' // 'line', 'dashed'

    this.meo = new THREE.Mesh(this.geometry, this.materials.ship)
    this.meoAngle = Math.PI + 0.99 //min: Math.PI + 0.99, max: Math.PI - 0.1
    this.meoRadius = 20
    this.meoX = Math.cos(this.meoAngle) * this.meoRadius
    this.meoY = Math.sin(this.meoAngle) * this.meoRadius
    this.meo.position.set(this.meoX, this.meoY, 0) // Z тут = 0 бо в системі orbitLeo
    this.meo.scale.setScalar(7.6)

    this.geo = new THREE.Mesh(this.geometry, this.materials.ship)
    this.geoAngle = Math.PI + 2.8 - 0.4//min: Math.PI + 2.8, max: Math.PI + 1.47
    this.geoRadius = 26
    this.geoX = Math.cos(this.geoAngle) * this.geoRadius
    this.geoY = Math.sin(this.geoAngle) * this.geoRadius
    this.geo.position.set(this.geoX, this.geoY, 0) // Z тут = 0 бо в системі orbitLeo
    this.geo.scale.setScalar(7.6)

    this.meoDashed = new THREE.Mesh(this.geometry, this.materials.ship)
    this.meoDashedAngle = Math.PI - 0.55 - 1 //Math.PI - 0.55
    this.meoDashedRadius = 15.5
    this.meoDashedX = Math.cos(this.meoDashedAngle) * this.meoDashedRadius
    this.meoDashedY = Math.sin(this.meoDashedAngle) * this.meoDashedRadius
    this.meoDashed.position.set(this.meoDashedX, this.meoDashedY, 0) // Z тут = 0 бо в системі orbitLeo
    this.meoDashed.scale.setScalar(7)

    this.geoDashed = new THREE.Mesh(this.geometry, this.materials.ship)
    this.geoDashedAngle = 0.009 //min: 0.009, max: 1.55
    this.geoDashedRadius = 20
    this.geoDashedX = Math.cos(this.geoDashedAngle) * this.geoDashedRadius
    this.geoDashedY = Math.sin(this.geoDashedAngle) * this.geoDashedRadius
    this.geoDashed.position.set(this.geoDashedX, this.geoDashedY, 0) // Z тут = 0 бо в системі orbitLeo
    this.geoDashed.scale.setScalar(7)
  }

  leoUpdate(delta, cameraPosition)
  {
    this.leoAngle -= delta * this.multiplier
    if (this.leoAngle < -Math.PI * 0.54) this.leoAngle = -Math.PI * 0.001

    const r = this.leoRadius
    const angle = this.leoAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.leo.position.set(x, y, 0)

    const nextAngle = angle + 0.00001
    const nextX = Math.cos(nextAngle) * r
    const nextY = Math.sin(nextAngle) * r

    const dx = x - nextX
    const dy = y - nextY
    const rotationZ = Math.atan2(dy, dx)

    this.leo.lookAt(cameraPosition)
    // this.leo.rotation.z = -rotationZ - 0.8 + Math.PI
  }


  meoUpdate(delta, cameraPosition)
  {
    if (this.meoStatus !== 'line')
    {
      this.meo.visible = false
      return
    }

    this.meo.visible = true

    this.meo.visible = (this.meoStatus === 'line')
    this.meoDashed.visible = (this.meoStatus === 'dashed')

    // 🔁 Крок анімації
    this.meoAngle -= delta * this.multiplier

    // Перемикання на meoDashed
    if (this.meoAngle < (Math.PI - 0.1))
    {
      const nextAngle = Math.PI - 0.55
      const nextX = Math.cos(nextAngle) * this.meoDashedRadius
      const nextY = Math.sin(nextAngle) * this.meoDashedRadius

      this.meoDashedAngle = nextAngle
      this.meoDashed.position.set(nextX, nextY, 0)
      this.meoDashed.lookAt(cameraPosition)

      this.meoStatus = "dashed"
      this.meo.visible = false
      this.meoDashed.visible = true
      return
    }

    const r = this.meoRadius
    const angle = this.meoAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.meo.position.set(x, y, 0)
    this.meo.lookAt(cameraPosition)
  }

  meoDashedUpdate(delta, cameraPosition)
  {
    if (this.meoStatus !== 'dashed')
    {
      this.meoDashed.visible = false
      return
    }

    this.meoDashed.visible = true

    // 🔁 Крок анімації
    this.meoDashedAngle -= delta * this.multiplier

    // Перемикання на meo
    if (this.meoDashedAngle < (Math.PI - 3.1225))
    {
      const nextAngle = Math.PI + 0.99
      const nextX = Math.cos(nextAngle) * this.meoRadius
      const nextY = Math.sin(nextAngle) * this.meoRadius

      this.meoAngle = nextAngle
      this.meo.position.set(nextX, nextY, 0)
      this.meo.lookAt(cameraPosition)

      this.meoStatus = "line"
      this.meo.visible = true
      this.meoDashed.visible = false
      return
    }

    const r = this.meoDashedRadius
    const angle = this.meoDashedAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.meoDashed.position.set(x, y, 0)
    this.meoDashed.lookAt(cameraPosition)
  }

  geoUpdate(delta, cameraPosition)
  {
    if (this.geoStatus !== 'line')
    {
      this.geo.visible = false
      return
    }

    this.geo.visible = true

    this.geo.visible = (this.geoStatus === 'line')
    this.geoDashed.visible = (this.geoStatus === 'dashed')

    // 🔁 Крок анімації
    this.geoAngle -= delta * this.multiplier

    // Перемикання на geoDashed
    if (this.geoAngle < (Math.PI + 1.47))
    {
      const nextAngle = 0.009
      const nextX = Math.cos(nextAngle) * this.geoDashedRadius
      const nextY = Math.sin(nextAngle) * this.geoDashedRadius

      this.geoDashedAngle = nextAngle
      this.geoDashed.position.set(nextX, nextY, 0)
      this.geoDashed.lookAt(cameraPosition)

      this.geoStatus = "dashed"
      this.geo.visible = false
      this.geoDashed.visible = true
      return
    }

    const r = this.geoRadius
    const angle = this.geoAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.geo.position.set(x, y, 0)
    this.geo.lookAt(cameraPosition)
  }


  geoDashedUpdate(delta, cameraPosition)
  {
    if (this.geoStatus !== 'dashed')
    {
      this.geoDashed.visible = false
      return
    }

    this.geoDashed.visible = true

    // 🔁 Крок анімації
    this.geoDashedAngle += delta * this.multiplier

    // Перемикання на geo
    if (this.geoDashedAngle > 1.5)
    {
      const nextAngle = Math.PI + 2.8
      const nextX = Math.cos(nextAngle) * this.geoRadius
      const nextY = Math.sin(nextAngle) * this.geoRadius

      this.geoAngle = nextAngle
      this.geo.position.set(nextX, nextY, 0)
      this.geo.lookAt(cameraPosition)

      this.geoStatus = "line"
      this.geo.visible = true
      this.geoDashed.visible = false
      return
    }

    const r = this.geoDashedRadius
    const angle = this.geoDashedAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.geoDashed.position.set(x, y, 0)
    this.geoDashed.lookAt(cameraPosition)
  }

  update(delta, cameraPosition)
  {
    this.meoUpdate(delta, cameraPosition)
    this.meoDashedUpdate(delta, cameraPosition)

    this.geoUpdate(delta, cameraPosition)
    this.geoDashedUpdate(delta, cameraPosition)

    this.leoUpdate(delta, cameraPosition)

  }
}