/**
 * MyLakeTile
 */
class MyLakeTile extends CGFobject {   
    constructor(scene, id, tileObj) {
        super(scene);
 
        this.id = id;
        
        this.tileObj = tileObj;
    }

    display(){
        this.tileObj.display();
    }
}