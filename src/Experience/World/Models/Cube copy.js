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
        this.geometry = new THREE.BoxGeometry(this.side, this.side, this.side)
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


        this.instance.add(this.fill)

        this.instance.position.x = -5

        // 🔷 FILL
        this.fill.material.depthWrite = true
        this.fill.material.depthTest = true
        this.fill.material.polygonOffset = true
        this.fill.material.polygonOffsetFactor = 2
        this.fill.material.polygonOffsetUnits = 2














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


