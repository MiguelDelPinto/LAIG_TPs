/**
 * MyFrog
 */
class MyFrog extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;    

        this.frog = new CGFOBJModel(this.scene, 'objects/frog.obj', false);

        /*this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.1, 0.5, 0.2, 1);
        this.material.setDiffuse(0.1, 0.5, 0.2, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.material.setShininess(1.0);
        //this.material.loadTexture('scenes/images/frog_diff.jpg');
        this.material.setTextureWrap('REPEAT', 'REPEAT');  */ 
    }

    display(){
        this.scene.pushMatrix();
            this.scene.scale(0.2, 0.2, 0.2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);

            //this.material.apply();
            this.frog.display();
        this.scene.popMatrix();
    }
}