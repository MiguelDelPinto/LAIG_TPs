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

        this.initBuffers();
    }

    initBuffers() {
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(){
        this.material.apply();
        this.plane.display();
    }

    updateTexCoords(length_s, length_t) {}
}