import * as THREE from "three"
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'





export default class Torus
{
    constructor()
    {


        // Parameters
        this.side = 1.5

        // Set cube
        this.geometry = new THREE.TorusGeometry(this.side * 2, this.side, 16, 16)
        this.instance = new THREE.Mesh(
            new THREE.BoxGeometry(this.side, this.side, this.side),
            new THREE.MeshBasicMaterial({
                color: 'white',
            })
        )

        this.geometry = new THREE.TorusGeometry(this.side * 1.5, this.side * 1.5 / 2, 8, 8)
        this.torus = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({
                color: 'white',
            })
        )
        // this.instance.add(this.torus)

        // OUTLINES v02

        function drawEdgesWithThickness({
            geometry,
            color = 0x00ff00,
            thickness = 0.2,
            resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
        })
        {
            // 1. Створюємо EdgesGeometry з твоєї геометрії
            const edgesGeometry = new THREE.EdgesGeometry(geometry)

            // 2. Витягуємо позиції ребер
            const edgePositions = edgesGeometry.attributes.position.array

            // 3. Створюємо LineSegmentsGeometry (розширена версія BufferGeometry)
            const lineSegmentsGeometry = new LineSegmentsGeometry()
            lineSegmentsGeometry.setPositions(edgePositions)

            // 4. Створюємо матеріал з товщиною
            const lineMaterial = new LineMaterial({
                color,
                linewidth: thickness,      // товщина у world units
                worldUnits: true,
                dashed: false,
                transparent: false,
                depthTest: true,
                depthWrite: false,
                toneMapped: false
            })
            lineMaterial.resolution.copy(resolution) // ОБОВ’ЯЗКОВО!
            lineMaterial.renderOrder = 2
            // 🔶 LINES
            lineMaterial.depthTest = true
            lineMaterial.depthWrite = false
            lineMaterial.transparent = true

            // 5. Створюємо лінії
            const lines = new LineSegments2(lineSegmentsGeometry, lineMaterial)

            return lines
        }

        this.instance = drawEdgesWithThickness({
            geometry: this.geometry,
            color: 0x000000,
            thickness: 0.05
        })

        this.fill = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({
                color: 0xD2D1CE,
            })
        )

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16),
            new THREE.MeshBasicMaterial({
                color: 0xFF5500
            })
        )
        this.instance.add(this.sphere)

        this.instance.add(this.fill)

        this.instance.position.x = 5

        // 🔷 FILL
        this.fill.material.depthWrite = true
        this.fill.material.depthTest = true
        this.fill.material.polygonOffset = true
        this.fill.material.polygonOffsetFactor = 2
        this.fill.material.polygonOffsetUnits = 2


    }

}


