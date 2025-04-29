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
        this.initialized = false //перед першим запуском

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
        this.errorMessages = [
            'Failed to connect',
            'Decommissioned',
            'Signal lost',
            'Collision Alarm'
        ]

        this.array = []

        this.zThreshold = 5 // чим менше, тим раніше зʼявляються

        this.generatePlanes(this.PARAMS.count, this.PARAMS.border);
        this.checkLinesForDistance()

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
            plane.userData.linesExpanded = false
            plane.userData.textExpanded = false

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
            this.addLines(plane, size, material)
            created++;
        }


    }

    addLines(plane, size, material)
    {

        const geometryLines = new THREE.PlaneGeometry(size * 0.15, size * 0.7)
        const linesGroup = new THREE.Group() //лінії по боках

        const offset = 0.1 // отступ ліній між собою
        const centerOffset = 0.2 // отступ ліній від квадрата

        for (let i = 0; i < 3; i++)
        {
            const line = new THREE.Mesh(geometryLines, material)
            line.position.x = -offset * i - centerOffset
            linesGroup.add(line)

        }
        for (let i = 0; i < 3; i++)
        {
            const line = new THREE.Mesh(geometryLines, material)
            line.position.x = offset * i + centerOffset
            linesGroup.add(line)
        }
        plane.add(linesGroup)

        const linesArray = linesGroup.children
        linesArray.forEach((line) =>
        {
            line.scale.y = 0
        })
    }

    addText(plane, size)
    {

        // 🔠 Troika Text
        const label = new Text();
        if (plane.userData.colorLabel === 'black')
        {
            // label.text = this.labelVariants[Math.floor(Math.random() * this.labelVariants.length)];
            label.text = ''
        }
        if (plane.userData.colorLabel === 'orange')
        {
            // label.text = this.errorMessages[Math.floor(Math.random() * this.errorMessages.length)]
            label.text = ''
        }
        // label.text = ""
        label.fontSize = size * 1.15;
        label.color = 0x000000;

        label.anchorX = 'left';        // Вирівнює текст по лівому краю
        label.anchorY = 'middle';      // Центрує по вертикалі
        if (plane.userData.colorLabel === 'black')
        {
            label.position.set(size / 2 + 0.45, 0.012, 0); // трохи правіше від плейна
        }
        if (plane.userData.colorLabel === 'orange')
        {
            label.position.set(size / 2 + 0.15, 0.012, 0); // трохи правіше від плейна
        }
        // label.scale.setScalar(0)

        label.sync();

        plane.add(label);
        plane.userData.label = label;
        plane.userData.originalText = label.text;
    }



    checkLinesForDistance()
    {
        const tempVec = new THREE.Vector3()

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)

            const zGate = tempVec.z
            const linesGroup = plane.children.find(child => child.isGroup) // знаходимо групу ліній
            if (!linesGroup) return

            const linesArray = linesGroup.children

            const dutation = 0.6
            const delay = 0.2
            const ease = "expo.inOut"

            // lines appear
            if (zGate >= this.zThreshold)
            {
                if (!plane.userData.linesExpanded && plane.userData.colorLabel === 'black')
                {
                    plane.userData.linesExpanded = true

                    for (let i = 0; i < linesArray.length / 2; i++)
                    {
                        const lineA = linesArray[i]
                        const lineB = linesArray[i + 3]

                        gsap.fromTo(
                            lineA.scale,
                            { y: 0 },
                            {
                                y: 1,
                                duration: dutation,
                                ease: ease,
                                delay: i * delay,
                                onComplete: () =>
                                {
                                    this.checkTextForDistance()
                                }
                            }
                        )

                        gsap.fromTo(
                            lineB.scale,
                            { y: 0 },
                            {
                                y: 1,
                                duration: dutation,
                                ease: ease,
                                delay: i * delay,
                            }
                        )
                    }
                }
            }

            //lines dispose 

            if (zGate < this.zThreshold)
            {
                if (plane.userData.linesExpanded && plane.userData.colorLabel === 'black')
                {
                    plane.userData.linesExpanded = false

                    for (let i = 2; i >= 0; i--)
                    {
                        const lineA = linesArray[i]
                        const lineB = linesArray[i + 3]

                        gsap.fromTo(
                            lineA.scale,
                            { y: 1 },
                            {
                                y: 0,
                                duration: dutation,
                                ease: ease,
                                delay: (2 - i) * delay,
                                onComplete: () =>
                                {
                                    this.checkTextForDistance()
                                }
                            }
                        )

                        gsap.fromTo(
                            lineB.scale,
                            { y: 1 },
                            {
                                y: 0,
                                duration: dutation,
                                ease: ease,
                                delay: (2 - i) * delay,
                            }
                        )
                    }
                }
            }




        })

    }



    checkTextForDistance()
    {
        const tempVec = new THREE.Vector3()

        this.array.forEach((plane) =>
        {
            plane.getWorldPosition(tempVec)

            const zGate = tempVec.z
            const label = plane.userData.label
            let labelText

            if (zGate >= this.zThreshold)
            {
                if (!plane.userData.textExpanded)
                {
                    plane.userData.textExpanded = true

                    // label.scale.setScalar(1)
                    if (plane.userData.colorLabel === 'black')
                    {
                        labelText = this.labelVariants[Math.floor(Math.random() * this.labelVariants.length)];
                    }
                    if (plane.userData.colorLabel === 'orange')
                    {
                        plane.material.color = new THREE.Color(0xFF5500)
                        label.color = 0xFF5500

                        labelText = this.errorMessages[Math.floor(Math.random() * this.errorMessages.length)]

                        this.blinkOrangePlane(plane)


                    }

                    if (this.initialized)
                    {
                        this.typeWriter(label, labelText, 50); // після запуску друкуємо красиво
                    }
                    else
                    {
                        console.log('initialized');

                        label.text = labelText; // на старті просто одразу весь текст
                        label.sync();
                    }



                }
            }
            if (zGate < this.zThreshold)
            {
                if (plane.userData.textExpanded)
                {
                    plane.userData.textExpanded = false

                    // label.scale.setScalar(0)



                    this.reverseTypeWriter(label, 10, () =>
                    {

                        plane.material.color = new THREE.Color(0x000000)
                        this.stopBlinkingPlane(plane); // Стопаємо мігання

                    })

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

    blinkOrangePlane(plane)
    {
        // Якщо вже є мігання — зупиняємо його перед новим
        if (plane.userData.blinkTween)
        {
            plane.userData.blinkTween.kill();
        }

        // Створюємо нову анімацію
        const tween = gsap.to(plane.material, {
            opacity: 0,
            duration: (Math.random() + 0.3) * 0.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        plane.userData.blinkTween = tween;
    }

    stopBlinkingPlane(plane)
    {
        if (plane.userData.blinkTween)
        {
            plane.userData.blinkTween.kill();
            plane.userData.blinkTween = null;
        }
        plane.material.opacity = 1; // повертаємо нормальну прозорість
    }


    update()
    {
        this.sizeCameraDistance()

        //поява ліній і тексту
        this.checkLinesForDistance()

        if (!this.initialized)
        {
            gsap.delayedCall(1, () =>
            {
                this.initialized = true
                console.log('FIRST INITIALIZED COMPLETE ✅')
            })
        }



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



}

