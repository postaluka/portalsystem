import * as THREE from 'three'

import Experience02 from '../../Experience02'

export default class Satellites
{
  constructor()
  {
    this.experience = new Experience02()
    this.materials = this.experience.materials

    this.geometry = new THREE.PlaneGeometry(0.18, 0.18)

    this.multiplier = 0.00005

    this.meoStatus = 'dashed' // 'line', 'dashed'

    this.meo = new THREE.Mesh(this.geometry, this.materials.ship)
    this.meoAngle = Math.PI + 0.99 //min: Math.PI + 0.99, max: Math.PI - 0.1
    this.meoRadius = 20
    this.meoX = Math.cos(this.meoAngle) * this.meoRadius
    this.meoY = Math.sin(this.meoAngle) * this.meoRadius
    this.meo.position.set(this.meoX, this.meoY, 0) // Z тут = 0 бо в системі orbitLeo
    this.meo.scale.setScalar(7)

    this.meoDashed = new THREE.Mesh(this.geometry, this.materials.ship)
    this.meoDashedAngle = Math.PI - 0.55 - 2.49
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

  meoUpdate(delta, cameraPosition)
  {
    if (this.meoStatus !== 'line')
    {
      this.meo.scale.setScalar(0)
      return
    }

    this.meo.scale.setScalar(7)

    // 🔁 Крок анімації
    this.meoAngle -= delta * this.multiplier

    // Switch satellite
    if (this.meoAngle < (Math.PI - 0.1))
    {
      this.meo.scale.setScalar(0)
      this.meoAngle = Math.PI + 0.99
      this.meoStatus = "dashed"
    }

    const r = this.meoRadius
    const angle = this.meoAngle

    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.meo.position.set(x, y, 0)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.meo.lookAt(cameraPosition)

  }

  meoDashedUpdate(delta, cameraPosition)
  {
    if (this.meoStatus !== 'dashed')
    {
      this.meoDashed.scale.setScalar(0)
      return
    }

    this.meoDashed.scale.setScalar(7)

    // 🔁 Крок анімації
    this.meoDashedAngle -= delta * this.multiplier

    // Switch satellite
    if (this.meoDashedAngle < (Math.PI - 3.13))
    {
      this.meoDashed.scale.setScalar(0)
      this.meoDashedAngle = Math.PI - 0.55
      this.meoStatus = "line"
    }

    const r = this.meoDashedRadius
    const angle = this.meoDashedAngle

    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.meoDashed.position.set(x, y, 0)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.meoDashed.lookAt(cameraPosition)

  }

  geoDashedUpdate(delta, cameraPosition)
  {
    // 🔁 Крок анімації
    this.geoDashedAngle += delta * this.multiplier
    if (this.geoDashedAngle > 1.55) this.geoDashedAngle = 0.009

    const r = this.geoDashedRadius
    const angle = this.geoDashedAngle

    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.geoDashed.position.set(x, y, 0)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.geoDashed.lookAt(cameraPosition)

  }
}