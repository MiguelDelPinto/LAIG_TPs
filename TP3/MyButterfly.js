/**
 * MyButterfly
 */
class MyButterfly extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;    

        this.butterfly = new CGFOBJModel(this.scene, 'objects/butterfly.obj', false);

        
        this.butterfly_material = new CGFappearance(this.scene);
        this.butterfly_material.setAmbient(0.2, 0.2, 0.2, 1);
        this.butterfly_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.butterfly_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.butterfly_material.setShininess(1.0);
        this.butterfly_material.loadTexture('scenes/images/UVButterflies.png');
        this.butterfly_material.setTextureWrap('REPEAT', 'REPEAT'); 
    }

    display(){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.butterfly_material.apply();
            this.butterfly.display();
        this.scene.popMatrix();
    }
}