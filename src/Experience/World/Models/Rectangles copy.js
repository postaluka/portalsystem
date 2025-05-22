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

    // Налаштування
    const totalObjects = 4
    const startAngle = -Math.PI * 0.001
    const endAngle = -Math.PI * 0.54
    const totalAngleSpan = startAngle - endAngle
    const angleStep = totalAngleSpan / (totalObjects - 1)

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

    this.black = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), this.material)
    this.blackAngle = -Math.PI * 0.001 //start: -Math.PI * 0.001, end: -Math.PI * 0.54  
    this.blackRadius = 14
    this.blackX = Math.cos(this.blackAngle) * this.blackRadius
    this.blackY = Math.sin(this.blackAngle) * this.blackRadius
    this.black.position.set(this.blackX, this.blackY, 0) // Z тут = 0 бо в системі orbitLeo
    this.black.scale.setScalar(2) // adjust size

    this.black02 = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), this.material)
    this.black02Angle = -Math.PI * 0.001 - 0.65 //start: -Math.PI * 0.001, end: -Math.PI * 0.54  
    this.black02Radius = 14
    this.black02X = Math.cos(this.black02Angle) * this.black02Radius
    this.black02Y = Math.sin(this.black02Angle) * this.black02Radius
    this.black02.position.set(this.black02X, this.black02Y, 0) // Z тут = 0 бо в системі orbitLeo
    this.black02.scale.setScalar(2) // adjust size

    this.black03 = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), this.material)
    this.black03Angle = -Math.PI * 0.001 - 1.3 //start: -Math.PI * 0.001, end: -Math.PI * 0.54  
    this.black03Radius = 14
    this.black03X = Math.cos(this.black03Angle) * this.black03Radius
    this.black03Y = Math.sin(this.black03Angle) * this.black03Radius
    this.black03.position.set(this.black03X, this.black03Y, 0) // Z тут = 0 бо в системі orbitLeo
    this.black03.scale.setScalar(2) // adjust size

    this.black04 = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), this.material)
    this.black04Angle = -Math.PI * 0.001 - 1.95 //start: -Math.PI * 0.001, end: -Math.PI * 0.54  
    this.black04Radius = 14
    this.black04X = Math.cos(this.black04Angle) * this.black04Radius
    this.black04Y = Math.sin(this.black04Angle) * this.black04Radius
    this.black04.position.set(this.black04X, this.black04Y, 0) // Z тут = 0 бо в системі orbitLeo
    this.black04.scale.setScalar(2) // adjust size

    /** ARROW */

    this.arrowGeometry = new THREE.BufferGeometry();
    this.arrowVertices = new Float32Array([
      -1, -1, 0,  // A (зміщено вниз)
      1, -1, 0,  // B
      0, 1, 0   // C (верхівка)
    ]);
    this.arrowGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.arrowVertices, 3)
    );
    this.arrowGeometry.setIndex([0, 1, 2]);
    this.arrowGeometry.computeVertexNormals();

    this.arrow = new THREE.Mesh(this.arrowGeometry, this.material);
    this.arrow.scale.setScalar(0.07) // adjust size
    this.arrow.position.set(0, 0, 0) // точно по центру
    this.arrow.rotation.set(0, 0, Math.PI - 0.75) // без обертання
    this.black.add(this.arrow)

    this.arrow02 = new THREE.Mesh(this.arrowGeometry, this.material);
    this.arrow02.scale.setScalar(0.07) // adjust size
    this.arrow02.position.set(0, 0, 0) // точно по центру
    this.arrow02.rotation.set(0, 0, Math.PI - 0.75) // без обертання
    this.black02.add(this.arrow02)

    this.arrow03 = new THREE.Mesh(this.arrowGeometry, this.material);
    this.arrow03.scale.setScalar(0.07) // adjust size
    this.arrow03.position.set(0, 0, 0) // точно по центру
    this.arrow03.rotation.set(0, 0, Math.PI - 0.75) // без обертання
    this.black03.add(this.arrow03)

    this.arrow04 = new THREE.Mesh(this.arrowGeometry, this.material);
    this.arrow04.scale.setScalar(0.07) // adjust size
    this.arrow04.position.set(0, 0, 0) // точно по центру
    this.arrow04.rotation.set(0, 0, Math.PI - 0.75) // без обертання
    this.black04.add(this.arrow04)

  }

  blackUpdate(delta, cameraPosition)
  {
    // 🔁 Крок анімації
    this.blackAngle -= delta * 0.0001
    if (this.blackAngle < - Math.PI * 0.54) this.blackAngle = -Math.PI * 0.001

    const r = this.blackRadius
    const angle = this.blackAngle

    // Поточна позиція
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.black.position.set(x, y, 0)

    // 🔮 Наступна позиція (на 1 крок вперед)
    const nextAngle = angle + 0.00001
    const nextX = Math.cos(nextAngle) * r
    const nextY = Math.sin(nextAngle) * r

    // Вектор напряму
    const dx = x - nextX
    const dy = y - nextY
    const rotationZ = Math.atan2(dy, dx)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.black.lookAt(cameraPosition)
    // this.black.rotation.x = 0
    // this.black.rotation.y = Math.PI / 2

    // 👉 Повертаємо вздовж напрямку
    this.black.rotation.z = -rotationZ - 0.8
  }

  blackUpdate02(delta, cameraPosition)
  {
    // 🔁 Крок анімації
    this.black02Angle -= delta * 0.0001
    if (this.black02Angle < - Math.PI * 0.54) this.black02Angle = -Math.PI * 0.001

    const r = this.black02Radius
    const angle = this.black02Angle

    // Поточна позиція
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.black02.position.set(x, y, 0)

    // 🔮 Наступна позиція (на 1 крок вперед)
    const nextAngle = angle + 0.00001
    const nextX = Math.cos(nextAngle) * r
    const nextY = Math.sin(nextAngle) * r

    // Вектор напряму
    const dx = x - nextX
    const dy = y - nextY
    const rotationZ = Math.atan2(dy, dx)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.black02.lookAt(cameraPosition)
    // this.black02.rotation.x = 0
    // this.black02.rotation.y = Math.PI / 2

    // 👉 Повертаємо вздовж напрямку
    this.black02.rotation.z = -rotationZ - 0.8 + Math.PI
  }

  blackUpdate03(delta, cameraPosition)
  {
    // 🔁 Крок анімації
    this.black03Angle -= delta * 0.0001
    if (this.black03Angle < - Math.PI * 0.54) this.black03Angle = -Math.PI * 0.001

    const r = this.black03Radius
    const angle = this.black03Angle

    // Поточна позиція
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.black03.position.set(x, y, 0)

    // 🔮 Наступна позиція (на 1 крок вперед)
    const nextAngle = angle + 0.00001
    const nextX = Math.cos(nextAngle) * r
    const nextY = Math.sin(nextAngle) * r

    // Вектор напряму
    const dx = x - nextX
    const dy = y - nextY
    const rotationZ = Math.atan2(dy, dx)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.black03.lookAt(cameraPosition)
    // this.black03.rotation.x = 0
    // this.black03.rotation.y = Math.PI / 2

    // 👉 Повертаємо вздовж напрямку
    this.black03.rotation.z = -rotationZ - 0.8 + Math.PI
  }

  blackUpdate04(delta, cameraPosition)
  {
    // 🔁 Крок анімації
    this.black04Angle -= delta * 0.0001
    if (this.black04Angle < - Math.PI * 0.54) this.black04Angle = -Math.PI * 0.001

    const r = this.black04Radius
    const angle = this.black04Angle

    // Поточна позиція
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    this.black04.position.set(x, y, 0)

    // 🔮 Наступна позиція (на 1 крок вперед)
    const nextAngle = angle + 0.00001
    const nextX = Math.cos(nextAngle) * r
    const nextY = Math.sin(nextAngle) * r

    // Вектор напряму
    const dx = x - nextX
    const dy = y - nextY
    const rotationZ = Math.atan2(dy, dx)

    // ✅ Робимо вигляд, ніби квадрат плоский і дивиться на камеру
    this.black04.lookAt(cameraPosition)
    // this.black04.rotation.x = 0
    // this.black04.rotation.y = Math.PI / 2

    // 👉 Повертаємо вздовж напрямку
    this.black04.rotation.z = -rotationZ - 0.8 + Math.PI
  }

}