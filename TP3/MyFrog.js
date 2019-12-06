/**
 * MyFrog
 */
class MyFrog extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;    

        this.frog = new CGFOBJModel(this.scene, 'objects/frog.obj', true);
    }

    display(){
        this.frog.display();
    }
}