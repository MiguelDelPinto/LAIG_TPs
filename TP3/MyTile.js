/**
 * MyTile
 */
class MyTile extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;
        
        this.plane = new MyPlane(scene, 15, 15);

        this.material = new CGFappearance(scene);
        this.material.loadTexture('scenes/images/tile.jpg');
    }

    display(){
        this.material.apply();
        this.plane.display();
    }
}