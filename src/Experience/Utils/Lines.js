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
        resolution = new THREE.Vector2(window.innerWidth, window.innerHeight),
    })
    {
        // 1. Створюємо EdgesGeometry з твоєї геометрії
        this.edgesGeometry = new THREE.EdgesGeometry(geometry, 1)

        // 2. Витягуємо позиції ребер
        this.edgePositions = this.edgesGeometry.attributes.position.array


        // 3. Створюємо LineSegmentsGeometry (розширена версія BufferGeometry)
        this.lineSegmentsGeometry = new LineSegmentsGeometry()

        this.filteredPositions = []
        this.onlyWidth(this.stepWidth)
        this.addGeneratedMeridians({
            radius: 14, // або твій this.side
            longSteps: 12 // кількість меридіанів
        })
        // this.addBottomParallel({
        //     radius: 14,
        //     longSteps: 48,
        //     phi: Math.PI * 0.985
        // })


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
        this.fillColor.material.polygonOffsetFactor = 4
        this.fillColor.material.polygonOffsetUnits = 4
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

    addGeneratedMeridians({
        radius = 1,
        latSteps = 80,
        longSteps = 3 // Кількість меридіанів
    })
    {
        const positions = []

        for (let i = 0; i < longSteps; i++)
        {
            const theta = (i / longSteps) * Math.PI * 2

            for (let j = 0; j <= latSteps - 1; j++)
            {
                const phi1 = (j / latSteps) * Math.PI
                const phi2 = ((j + 1) / latSteps) * Math.PI

                const a = new THREE.Vector3(
                    radius * Math.sin(phi1) * Math.cos(theta),
                    radius * Math.cos(phi1),
                    radius * Math.sin(phi1) * Math.sin(theta)
                )

                const b = new THREE.Vector3(
                    radius * Math.sin(phi2) * Math.cos(theta),
                    radius * Math.cos(phi2),
                    radius * Math.sin(phi2) * Math.sin(theta)
                )

                positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
            }
        }

        for (let i = 0; i < positions.length; i += 6)
        {
            this.filteredPositions.push(
                positions[i + 0], positions[i + 1], positions[i + 2],
                positions[i + 3], positions[i + 4], positions[i + 5]
            )
        }
    }

    addBottomParallel({
        radius = 1,
        longSteps = 32,
        phi = Math.PI * 0.98 // дуже близько до низу
    })
    {
        const positions = []

        for (let i = 0; i < longSteps; i++)
        {
            const theta1 = (i / longSteps) * Math.PI * 2
            const theta2 = ((i + 1) / longSteps) * Math.PI * 2

            const a = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta1),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta1)
            )

            const b = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta2),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta2)
            )

            positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
        }

        for (let i = 0; i < positions.length; i += 6)
        {
            this.filteredPositions.push(
                positions[i + 0], positions[i + 1], positions[i + 2],
                positions[i + 3], positions[i + 4], positions[i + 5]
            )
        }
    }




    addOutline(geometry, color = 0xFF5500, thickness = 0.001)
    {
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.BackSide, // щоб було видно ззовні
            depthTest: true,
            depthWrite: false
        })

        const outlineMesh = new THREE.Mesh(geometry, outlineMaterial)
        const scaleFactor = 1 + thickness
        outlineMesh.scale.setScalar(scaleFactor)
        outlineMesh.renderOrder = 1

        return outlineMesh


    }




}