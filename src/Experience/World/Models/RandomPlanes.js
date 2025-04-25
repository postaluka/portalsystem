import * as THREE from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from "gsap";
import { Text } from 'troika-three-text'

import Experience from "../../Experience";
import PARAMS from "../../Utils/PARAMS";


export default class RandomPlanes
{
    constructor({ radius = 16 })
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

            this.addText(plane, size)
            created++;
        }
    }

    addText(plane, size)
    {

        // 🔠 Troika Text
        const label = new Text();
        label.text = this.labelVariants[Math.floor(Math.random() * this.labelVariants.length)];
        label.fontSize = size;

        if (plane.userData.colorLabel === 'black')
        {
            label.color = 0x000000;

        }
        if (plane.userData.colorLabel === 'orange')
        {
            label.color = 0xFF5500;

        }
        label.anchorX = 'left';        // Вирівнює текст по лівому краю
        label.anchorY = 'middle';      // Центрує по вертикалі
        label.position.set(size / 2 + 0.05, 0, 0.01); // трохи правіше від плейна

        label.sync();

        plane.add(label);
        plane.userData.label = label;
        plane.userData.originalText = label.text;
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
        const zBorder = 9

        const errorMessages = [
            'Failed to connect',
            'Decommissioned',
            'Signal lost',
            'Collision Alarm'
        ]

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)
            const z = tempVec.z

            const label = plane.userData.label

            if (plane.userData.colorLabel === 'orange')
            {
                if (z >= zBorder)
                {
                    plane.material.color = new THREE.Color(0xFF5500)

                    if (label)
                    {
                        label.color = 0xFF5500

                        // Якщо ще немає вибраного тексту — обрати і зберегти
                        if (!plane.userData.errorText)
                        {
                            plane.userData.errorText = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                            this.typeWriter(label, plane.userData.errorText, 10)
                        }

                        // label.text = plane.userData.errorText
                        // label.sync()
                    }
                }
                else
                {
                    plane.material.color = new THREE.Color(0x000000)

                    if (label)
                    {
                        label.color = 0x000000

                        label.text = plane.userData.originalText || ''
                        label.sync()

                        // ❗очищаємо збережене повідомлення, щоб при наступному зближенні обрати нове
                        plane.userData.errorText = null
                    }
                }
            }
        })
    }

    typeWriter(label, fullText, speed = 50)
    {
        let currentIndex = 0

        const type = () =>
        {
            if (currentIndex <= fullText.length)
            {
                label.text = fullText.slice(0, currentIndex)
                label.sync()
                currentIndex++
                setTimeout(type, speed)
            }
        }

        type()
    }

    reverseTypeWriter(label, speed = 50, onComplete = () => { })
    {
        let currentIndex = label.text.length

        const erase = () =>
        {
            if (currentIndex >= 0)
            {
                label.text = label.text.slice(0, currentIndex)
                label.sync()
                currentIndex--
                setTimeout(erase, speed)
            }
            else
            {
                onComplete()
            }
        }

        erase()
    }

    checkPlaneLabels()
    {
        const tempVec = new THREE.Vector3()
        const zThreshold = 6

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)
            const z = tempVec.z

            const label = plane.userData.label

            if (z >= zThreshold)
            {
                // Якщо тексту немає – створити і набивати текст
                if (!label)
                {
                    this.addText(plane, plane.geometry.parameters.width)

                    const newLabel = plane.userData.label
                    const originalText = newLabel.text
                    newLabel.text = '' // Починаємо з порожнього тексту
                    newLabel.sync()

                    this.typeWriter(newLabel, originalText, 50) // Анімація появи

                }
            }
            else
            {
                // Якщо текст є – зробити reverse typewriter
                if (label && !plane.userData.deleting)
                {
                    plane.userData.deleting = true // Щоб не дублювати reverse

                    this.reverseTypeWriter(label, 50, () =>
                    {
                        // Після завершення reverse — видалити текст
                        plane.remove(label)
                        if (label.dispose) label.dispose()
                        plane.userData.label = null
                        plane.userData.deleting = false
                    })
                }
            }
        })
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

        this.generatePlanes(this.PARAMS.count, this.PARAMS.border);

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
        this.checkPlaneLabels()

        this.highlightPlane()


    }

}

