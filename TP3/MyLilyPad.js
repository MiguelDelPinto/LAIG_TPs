/**
 * MyLilyPad
 */
class MyLilyPad extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;
        
        this.lilyPad = new CGFOBJModel(this.scene, 'objects/lilypad.obj', false);

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.2, 0.5, 0.3, 1);
        this.material.setDiffuse(0.2, 0.5, 0.3, 1);
        this.material.setSpecular(0.1, 0.3, 0.2, 0.1);
        this.material.setShininess(1.0);

        this.material.loadTexture('scenes/images/lilypad.jpg');
        this.material.setTextureWrap('REPEAT', 'REPEAT');   
    }

    display(){
        this.material.apply();
        this.lilyPad.display();
    }
}