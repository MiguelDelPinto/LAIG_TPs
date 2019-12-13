/**
 * MyFrog
 */
class MyFrog extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;    

        this.frog = new CGFOBJModel(this.scene, 'objects/frog.obj', false);
    }

    display(){
        this.scene.pushMatrix();
            this.scene.scale(0.2, 0.2, 0.2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.frog.display();
        this.scene.popMatrix();
    }
}