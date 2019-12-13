/**
 * MyRock
 */
class MyRock extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;
        
        this.rock = new CGFOBJModel(this.scene, 'objects/rock.obj', false);

        /*this.material = new CGFappearance(scene);
        this.material.setAmbient(0.9, 0.9, 0.9, 1);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.material.loadTexture('scenes/images/tile.jpg');
        this.material.setTextureWrap('REPEAT', 'REPEAT');        */
    }

    display(){
        this.rock.display();
    }
}