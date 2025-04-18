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
        this.edgesGeometry = new THREE.EdgesGeometry(geometry)

        // 2. Витягуємо позиції ребер
        this.edgePositions = this.edgesGeometry.attributes.position.array

        // 3. Створюємо LineSegmentsGeometry (розширена версія BufferGeometry)
        this.lineSegmentsGeometry = new LineSegmentsGeometry()
        this.lineSegmentsGeometry.setPositions(this.edgePositions)

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
        this.fillColor.material.polygonOffsetFactor = 2
        this.fillColor.material.polygonOffsetUnits = 2

        return this.fillColor
    }
}