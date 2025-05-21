import * as THREE from 'three'

export default class Rectangles
{
  constructor()
  {
    this.geometry = new THREE.PlaneGeometry(0.18, 0.18)
    this.material = new THREE.MeshBasicMaterial({
      color: 0x050505,
      side: THREE.DoubleSide,
      transparent: true,
    })

    this.leo = new THREE.Mesh(this.geometry, this.material)
    this.leoAngle = - Math.PI / 2
    this.leoRadius = 14
    this.leoX = Math.cos(this.leoAngle) * this.leoRadius
    this.leoY = Math.sin(this.leoAngle) * this.leoRadius
    this.leo.position.set(this.leoX, this.leoY, 0) // Z тут = 0 бо в системі orbitLeo

    this.meo = new THREE.Mesh(this.geometry, this.material)
    this.meoAnlge = - Math.PI / 1.46
    this.meoRadius = 20
    this.meoX = Math.cos(this.meoAnlge) * this.meoRadius
    this.meoY = Math.sin(this.meoAnlge) * this.meoRadius
    this.meo.position.set(this.meoX, this.meoY, 0) // Z тут = 0 бо в системі orbitLeo
    this.meo.scale.setScalar(1.1) // adjust size

    this.geo = new THREE.Mesh(this.geometry, this.material)
    this.geoAngle = - Math.PI / 1.88
    this.geoRadius = 26
    this.geoX = Math.cos(this.geoAngle) * this.geoRadius
    this.geoY = Math.sin(this.geoAngle) * this.geoRadius
    this.geo.position.set(this.geoX, this.geoY, 0) // Z тут = 0 бо в системі orbitLeo
    this.geo.scale.setScalar(1.2) // adjust size

    this.black = new THREE.Mesh(new THREE.PlaneGeometry(0.001, 0.001), this.material)
    this.blackAngle = -Math.PI * 0.001 //start: -Math.PI * 0.001, end: -Math.PI * 0.54  
    this.blackRadius = 14
    this.blackX = Math.cos(this.blackAngle) * this.blackRadius
    this.blackY = Math.sin(this.blackAngle) * this.blackRadius
    this.black.position.set(this.blackX, this.blackY, 0) // Z тут = 0 бо в системі orbitLeo
    this.black.scale.setScalar(2) // adjust size

    /** ARROW */

    this.arrowGeometry = new THREE.BufferGeometry();
    this.arrowVertices = new Float32Array([
      -0.5, -0.5, 0,  // A (зміщено вниз)
      0.5, -0.5, 0,  // B
      0, 0.5, 0   // C (верхівка)
    ]);
    this.arrowGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.arrowVertices, 3)
    );
    this.arrowGeometry.setIndex([0, 1, 2]);
    this.arrowGeometry.computeVertexNormals();
    this.arrow = new THREE.Mesh(this.arrowGeometry, this.material);
    this.arrow.scale.setScalar(0.25) // adjust size
    this.arrow.position.set(0, 0, 0) // точно по центру
    this.arrow.rotation.set(0, 0, Math.PI) // без обертання
    this.black.add(this.arrow)

  }

  blackUpdate(delta, cameraPosition)
  {
    // Анімація blackAngle
    this.blackAngle -= delta * 0.0005 // ← швидкість обертання
    // console.log(this.blackAngle);
    if (this.blackAngle < -Math.PI * 0.54) this.blackAngle = - Math.PI * 0.001


    // Обчислюємо нові координати
    const r = this.blackRadius
    const angle = this.blackAngle
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r

    // Оновлюємо позицію прямокутника
    this.black.position.set(x, y, 0)

    // (опційно) Повертаємо до камери
    this.black.lookAt(cameraPosition)

    this.black.rotation.z = delta * 0.0005


  }
}