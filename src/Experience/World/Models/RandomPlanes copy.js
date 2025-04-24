import * as THREE from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import Experience from "../../Experience";

export default class RandomPlanes
{
    constructor({ radius = 16, count = 300, border = 2 })
    {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.loader = this.experience.loaders

        this.radius = radius;
        this.count = count;
        this.border = border
        this.instance = new THREE.Group();

        // Доступні розміри
        this.sizeVariants = [0.1, 0.12, 0.16, 0.22];
        this.labelVariants = Array.from({ length: 10 }, (_, i) => `1998-${i}0A`);

        this.array = []

        this.generatePlanes();
        this.addLabels()
    }

    generatePlanes()
    {
        let created = 0;
        const maxDistance = this.radius + this.border;

        while (created < this.count)
        {
            const distance = this.radius + Math.random() * this.border;

            // Збільшуємо шанс створення плейна на великій відстані
            const chance = (distance - this.radius) / this.border; // 0 → близько, 1 → далі
            if (Math.random() > chance) continue; // пропускаємо, якщо занадто близько

            // Випадковий розмір
            const size = this.sizeVariants[Math.floor(Math.random() * this.sizeVariants.length)];

            // Геометрія та матеріал
            const colors = [
                new THREE.Color(0xFF5500),
                new THREE.Color('black'),
                new THREE.Color('black'),
                new THREE.Color('black'),
            ]
            const color = colors[Math.floor(Math.random() * colors.length)]
            const geometry = new THREE.PlaneGeometry(size, size);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color),
                side: THREE.DoubleSide
            });

            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI;

            // Випадкове положення в сферичному просторі
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const x = distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);

            plane.position.set(x, y, z);
            // plane.lookAt(this.camera.position);

            this.instance.add(plane);
            this.array.push(plane);

            created++;
        }

    }

    addLabels()
    {


        this.loader.font.load("/font/Inter 28pt_Regular.json", (font) =>
        {

            this.array.forEach((plane, index) =>
            {
                if (index % 4 !== 0) return;

                const planeColor = plane.material.color
                const textMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(planeColor) });


                const planeSize = plane.geometry.parameters.width
                const labelText = this.labelVariants[Math.floor(Math.random() * this.labelVariants.length)];

                const textGeo = new TextGeometry(labelText, {
                    font: font,
                    size: planeSize * 0.5,
                    height: 0.001,
                    curveSegments: 4,
                    bevelEnabled: false
                });

                const textMesh = new THREE.Mesh(textGeo, textMaterial);

                textGeo.computeBoundingBox();
                const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
                const textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;

                textMesh.position.set(
                    planeSize / 2 + 0.05, // праворуч від центру плейна
                    -textHeight / 2,      // по центру по вертикалі
                    0.01                  // трохи над поверхнею плейна
                );

                const label = new THREE.Group();
                label.add(textMesh);
                plane.add(label);
            });
        });
    }

} 
