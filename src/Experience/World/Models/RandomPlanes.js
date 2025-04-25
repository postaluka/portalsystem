import * as THREE from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from "gsap";

import Experience from "../../Experience";
import PARAMS from "../../Utils/PARAMS";


export default class RandomPlanes
{
    constructor({ radius = 16, border = 2 })
    {

        this.PARAMS = PARAMS

        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.loader = this.experience.loaders

        this.radius = radius;
        this.count = this.PARAMS.count;
        this.border = this.PARAMS.border
        this.instance = new THREE.Group();

        this.instance.rotation.x = 0.33

        // Доступні розміри
        this.sizeVariants = [0.2, 0.24, 0.25];

        this.labelVariants = Array.from({ length: 10 }, (_, i) => `1998-${i}0A`);

        this.array = []

        this.generatePlanes(this.PARAMS.count, this.PARAMS.border);
        this.addLabels()

        this.debug()
    }

    generatePlanes(count, border)
    {
        const maxDistance = this.radius + border;
        const minDistanceBetween = 1;
        const maxAttempts = count * 10; // Щоб уникнути нескінченного циклу

        this.array = []

        for (let attempts = 0, created = 0; attempts < maxAttempts && created < count; attempts++)
        {
            const distance = this.radius + Math.random() * border;

            const chance = (distance - this.radius) / border;
            if (Math.random() > chance) continue;

            const size = this.sizeVariants[Math.floor(Math.random() * this.sizeVariants.length)];

            const colorLabelArray = [
                'orange',
                'black',
                'black',
            ];
            const colorLabel = colorLabelArray[Math.floor(Math.random() * colorLabelArray.length)];
            const geometry = new THREE.PlaneGeometry(size, size);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0x000000),
                side: THREE.DoubleSide,
                transparent: true
            });


            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI;

            plane.userData.colorLabel = colorLabel

            // Верхня півкуля з урізанням
            const topCutoff = this.PARAMS.topCutoff;
            const phiMin = Math.PI * topCutoff / 2;
            const phiMax = Math.PI / 2;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * (phiMax - phiMin) + phiMin;

            const x = distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);

            const newPosition = new THREE.Vector3(x, y, z);

            let tooClose = false;
            for (const other of this.array)
            {
                if (newPosition.distanceTo(other.position) < minDistanceBetween)
                {
                    tooClose = true;
                    break;
                }
            }

            if (tooClose) continue;

            plane.position.copy(newPosition);
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
                // if (0 === 0) return
                // if (index % 7 !== 0) return;
                if (plane.geometry.parameters.width !== this.sizeVariants[2]) return


                const planeColor = plane.material.color
                const textMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(planeColor) });

                const planeSize = plane.geometry.parameters.width
                const labelText = this.labelVariants[Math.floor(Math.random() * this.labelVariants.length)];

                const textGeo = new TextGeometry(labelText, {
                    font: font,
                    size: planeSize * 0.85,
                    height: 0.001,
                    curveSegments: 4,
                    bevelEnabled: false
                });

                const textMesh = new THREE.Mesh(textGeo, textMaterial);
                plane.userData.textMesh = textMesh;
                plane.userData.textMaterial = textMaterial

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

    sizeCameraDistance()
    {
        const tempVec = new THREE.Vector3()

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)
            const z = tempVec.z

            const baseSize = plane.geometry.parameters.width

            // Нормалізуємо в діапазоні 15 (близько) до -15 (далеко)
            const t = THREE.MathUtils.clamp((15 - z) / 30, 0, 1)


            // Обчислюємо новий розмір
            const newSize = THREE.MathUtils.lerp(baseSize * 1.4, 0.001, t)

            // Масштабуємо плейн
            const scale = newSize / baseSize * this.PARAMS.maxSize
            plane.scale.setScalar(scale)

        })
    }


    highlightPlane()
    {
        const tempVec = new THREE.Vector3()
        const zBorder = 6

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)
            const z = tempVec.z

            const labelMaterial = plane.userData.textMaterial

            if (plane.userData.colorLabel === 'orange' && z >= zBorder)
            {

                plane.material.color = new THREE.Color(0xFF5500)
                // plane.label.material.color = new THREE.Color(0xFF5500)
                labelMaterial?.color.set(0xFF5500)

            } else if (plane.userData.colorLabel === 'orange' && z < zBorder)
            {
                plane.material.color = new THREE.Color(0x000000)
                // plane.label.material.color = new THREE.Color(0x000000)
                labelMaterial?.color.set(0x000000)
            }
        })


    }

    highlightText()
    {
        const tempVec = new THREE.Vector3();
        const zBorder = 5;

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec);
            const z = tempVec.z;

            const textMesh = plane.userData.textMesh;
            if (!textMesh) return;

            if (z < zBorder)
            {
                textMesh.scale.setScalar(0.0001); // практично невидимий
            }
            else
            {
                textMesh.scale.setScalar(1); // повертаємо нормальний розмір
            }
        });
    }




    resetPlanes()
    {
        // Видалити старі плейни з групи і памʼяті
        this.array.forEach((plane) =>
        {
            this.instance.remove(plane);
            plane.geometry.dispose();
            plane.material.dispose();
        });


        this.array = [];


        // Згенерувати нові
        this.generatePlanes(this.PARAMS.count, this.PARAMS.border);
        this.addLabels();
    }

    setFunctions()
    {
        this.functions = {
            reset: () =>
            {
                this.resetPlanes()
            }
        }
    }

    debug()
    {
        this.debug = this.experience.debug

        if (this.debug.active)
        {
            this.setFunctions()
            this.debug.randomPlanesFolder.add(this.functions, 'reset').name('check random iterations')
            this.debug.randomPlanesFolder.add(this.PARAMS, 'maxSize').min(0.05).max(1).step(0.01).onFinishChange((value) =>
            {
                this.resetPlanes()
            })
            this.debug.randomPlanesFolder.add(this.PARAMS, 'count').min(50).max(1000).step(1).onFinishChange((value) =>
            {
                this.resetPlanes()
            })
            this.debug.randomPlanesFolder.add(this.PARAMS, 'topCutoff').min(0).max(1).step(0.01).onFinishChange((value) =>
            {
                this.resetPlanes()
            })
            this.debug.randomPlanesFolder.add(this.PARAMS, 'border').min(0).max(10).step(0.5).name('topLimit').onFinishChange((value) =>
            {
                this.resetPlanes()
            })
        }
    }

    update()
    {
        this.sizeCameraDistance()
        this.highlightPlane()
        this.highlightText()

    }

} 
