/**
 * MyLakeTile
 */
class MyLakeTile extends CGFobject {   
    constructor(scene, id, rock) {
        super(scene);
 
        this.id = id;
        
        this.rock = rock;
    }

    display(){
        this.rock.display();
    }
}