import * as THREE from "three"

import Experience from "../../Experience"
import Lines from "../../Utils/Lines"

export default class Suzanne
{
    constructor()
    {


        this.experience = new Experience()
        this.lines = new Lines()
        this.time = this.experience.time
        this.animation = new Animation()

        this.materials = this.experience.materials

        this.gltfLoader = this.experience.loaders.gltfLoader

        this.instance = new THREE.Group()

        this.loadModel()



    }

    loadModel()
    {
        this.gltfLoader.load(
            '/models/Suzanne.gltf',
            (gltf) =>
            {
                // this.instance.add(gltf.scene)


                this.geometry = gltf.scene.children[0].geometry





                this.instanceLines = this.lines.draw({
                    geometry: this.geometry,
                    color: 0x000000,
                    thickness: 0.05
                })

                this.instanceFill = this.lines.fill(this.geometry, 0xD2D1CE)
                this.instance.add(this.instanceLines, this.instanceFill)

                this.instance.scale.setScalar(3)





            }
        )
    }


}
