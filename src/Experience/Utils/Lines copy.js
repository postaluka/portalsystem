import * as THREE from "three"

import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'

export default class Lines 
{
    constructor()
    {


    }

    draw({
        geometry,
        color = 0x00ff00,
        thickness = 0.2,
        resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    })
    {
        // 1. Створюємо EdgesGeometry з твоєї геометрії
        this.edgesGeometry = new THREE.EdgesGeometry(geometry, 0.2)

        // 2. Витягуємо позиції ребер
        this.edgePositions = this.edgesGeometry.attributes.position.array


        // 3. Створюємо LineSegmentsGeometry (розширена версія BufferGeometry)
        this.lineSegmentsGeometry = new LineSegmentsGeometry()

        this.filteredPositions = []
        this.onlyWidth()
        this.onlyHeights()

        // this.lineSegmentsGeometry.setPositions(this.edgePositions)
        this.lineSegmentsGeometry.setPositions(this.filteredPositions)

        // 4. Створюємо матеріал з товщиною
        this.lineMaterial = new LineMaterial({
            color,
            linewidth: thickness,      // товщина у world units
            worldUnits: true,
            dashed: false,
            transparent: false,
            depthTest: true,
            depthWrite: false,
            toneMapped: false
        })
        this.lineMaterial.resolution.copy(resolution) // ОБОВ’ЯЗКОВО!
        this.lineMaterial.renderOrder = 2

        // 🔶 LINES
        this.lineMaterial.depthTest = true
        this.lineMaterial.depthWrite = false
        this.lineMaterial.transparent = true

        // 5. Створюємо лінії
        this.lines = new LineSegments2(this.lineSegmentsGeometry, this.lineMaterial)

        return this.lines
    }

    fill(geometry, color = 0xD2D1CE)
    {
        this.fillColor = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: color,
            }))

        this.fillColor.material.depthWrite = true
        this.fillColor.material.depthTest = true
        this.fillColor.material.polygonOffset = true
        this.fillColor.material.polygonOffsetFactor = 20
        this.fillColor.material.polygonOffsetUnits = 20
        // this.fillColor.material.transparent = true
        // this.fillColor.material.opacity = 0.5

        return this.fillColor
    }

    onlyWidth()
    {

        // Крок для округлення Y (щоб об'єднати близькі рівні в одну "широту")
        this.yPrecision = 0.01
        this.yGroups = {} // ключ: y, значення: масив ребер


        for (let i = 0; i < this.edgePositions.length; i += 6)
        {
            const a = new THREE.Vector3(
                this.edgePositions[i],
                this.edgePositions[i + 1],
                this.edgePositions[i + 2]
            )
            const b = new THREE.Vector3(
                this.edgePositions[i + 3],
                this.edgePositions[i + 4],
                this.edgePositions[i + 5]
            )

            const dir = new THREE.Vector3().subVectors(b, a).normalize()
            const dotY = Math.abs(dir.dot(new THREE.Vector3(0, 1, 0)))

            // Паралель — горизонтальна лінія
            if (dotY < 0.1)
            {
                // ❗ перевірка: обидві точки на одній широті
                const sameLatitude = Math.abs(a.y - b.y) < 0.01
                if (!sameLatitude) continue

                const yMid = ((a.y + b.y) / 2).toFixed(2) // округлюємо до 0.01
                if (!this.yGroups[yMid]) this.yGroups[yMid] = []
                this.yGroups[yMid].push([a, b])
            }
        }

        // Тепер малюємо тільки через одну "паралель"

        const yKeys = Object.keys(this.yGroups).sort((a, b) => parseFloat(b) - parseFloat(a)) // від верху до низу

        this.stepWidth = 2
        for (let i = 0; i < yKeys.length; i++)
        {
            if (i % this.stepWidth !== 0) continue // пропускаємо кожну другу паралель

            const group = this.yGroups[yKeys[i]]
            for (const [a, b] of group)
            {
                this.filteredPositions.push(
                    a.x, a.y, a.z,
                    b.x, b.y, b.z
                )
            }
        }
    }

    onlyHeights()
    {
        const xzGroups = {}
        const stepMeridian = 2
        const precision = 0.01

        for (let i = 0; i < this.edgePositions.length; i += 6)
        {
            const a = new THREE.Vector3(
                this.edgePositions[i],
                this.edgePositions[i + 1],
                this.edgePositions[i + 2]
            )
            const b = new THREE.Vector3(
                this.edgePositions[i + 3],
                this.edgePositions[i + 4],
                this.edgePositions[i + 5]
            )

            const dir = new THREE.Vector3().subVectors(b, a).normalize()
            const dotY = Math.abs(dir.dot(new THREE.Vector3(0, 1, 0)))

            // Вертикальні лінії (меридіани)
            if (dotY > 0.9)
            {
                // const sameLongitude = Math.abs(a.x - b.x) < precision && Math.abs(a.z - b.z) < precision
                // if (!sameLongitude) continue

                const xMid = ((a.x + b.x) / 2).toFixed(2)
                const zMid = ((a.z + b.z) / 2).toFixed(2)
                const xzKey = `${xMid}_${zMid}`

                if (!xzGroups[xzKey]) xzGroups[xzKey] = []
                xzGroups[xzKey].push([a, b])
            }
        }

        const xzKeys = Object.keys(xzGroups).sort()

        for (let i = 0; i < xzKeys.length; i++)
        {
            if (i % stepMeridian !== 0) continue // через одну довготу

            const group = xzGroups[xzKeys[i]]
            for (const [a, b] of group)
            {
                this.filteredPositions.push(
                    a.x, a.y, a.z,
                    b.x, b.y, b.z
                )
            }
        }
    }



}