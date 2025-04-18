import * as THREE from "three"

import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'

import Experience from "../../Experience"
import Materials from "../../Resources/Materials"



export default class Cube
{
    constructor()
    {

        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.materials = this.experience.materials

        // Parameters
        this.side = 3

        // Set cube
        this.geometryCube = new THREE.BoxGeometry(this.side, this.side, this.side)
        this.instance = new THREE.Mesh(
            new THREE.BoxGeometry(this.side, this.side, this.side),
            new THREE.MeshBasicMaterial({
                color: 'white',
            })
        )

        this.geometryTorus = new THREE.TorusGeometry(this.side * 1.5, this.side * 1.5 / 2, 8, 8)
        this.torus = new THREE.Mesh(
            this.geometryTorus,
            new THREE.MeshBasicMaterial({
                color: 'white',
            })
        )
        this.instance.add(this.torus)


        // OUTLINES

        const thicknessOffset = 0.03
        function createEdgeStroke(p1, p2, thickness = 0.2)
        {
            const direction = new THREE.Vector3().subVectors(p2, p1)
            const length = direction.length()

            // Центральна позиція між двома точками
            const center = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)

            // Створюємо тонкий циліндр (виглядає краще за box)
            const geometry = new THREE.CylinderGeometry(thickness + thicknessOffset, thickness + thicknessOffset, length, 6, 1, true)
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

            const stroke = new THREE.Mesh(geometry, material)

            // Обертаємо циліндр у напрямку між p1 → p2
            stroke.position.copy(center)

            // По замовчуванню циліндр в Three.js направлений вздовж Y — тому потрібно обернути
            stroke.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0), // Вісь циліндра
                direction.clone().normalize()
            )

            return stroke
        }

        const edgeGeoCube = new THREE.EdgesGeometry(this.geometryCube)
        const posCube = edgeGeoCube.attributes.position.array

        const edgeGeoTorus = new THREE.EdgesGeometry(this.geometryTorus)
        const posTorus = edgeGeoTorus.attributes.position.array

        for (let i = 0; i < posCube.length; i += 6)
        {
            const p1 = new THREE.Vector3(posCube[i], posCube[i + 1], posCube[i + 2])
            const p2 = new THREE.Vector3(posCube[i + 3], posCube[i + 4], posCube[i + 5])
            const stroke = createEdgeStroke(p1, p2, 0.02) // <-- тут товщина!
            this.instance.add(stroke)
        }

        for (let i = 0; i < posTorus.length; i += 6)
        {
            const p1 = new THREE.Vector3(posTorus[i], posTorus[i + 1], posTorus[i + 2])
            const p2 = new THREE.Vector3(posTorus[i + 3], posTorus[i + 4], posTorus[i + 5])
            const stroke = createEdgeStroke(p1, p2, 0.02) // <-- тут товщина!
            this.instance.add(stroke)
        }

        /** POINTS */

        const sphereRadius = 0.05  // або трохи менше, ніж товщина stroke

        const usedVertices = new Set()

        for (let i = 0; i < posCube.length; i += 3)
        {
            const x = posCube[i]
            const y = posCube[i + 1]
            const z = posCube[i + 2]

            const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`
            if (usedVertices.has(key)) continue // Уникаємо дублювання сфер

            usedVertices.add(key)

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(sphereRadius, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            )

            sphere.position.set(x, y, z)
            this.instance.add(sphere)
        }

        for (let i = 0; i < posTorus.length; i += 3)
        {
            const x = posTorus[i]
            const y = posTorus[i + 1]
            const z = posTorus[i + 2]

            const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`
            if (usedVertices.has(key)) continue // Уникаємо дублювання сфер

            usedVertices.add(key)

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(sphereRadius, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            )

            sphere.position.set(x, y, z)
            this.instance.add(sphere)
        }












        // this.debug()

    }

    debug()
    {

        // Debug
        this.debug = this.experience.debug
        if (this.debug.active)
        {
            this.debug.ui.add(this.instance.position, 'x', -10, 10, 0.01).name('position.x')
        }
    }
}
