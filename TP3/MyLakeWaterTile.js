/**
 * MyLakeWaterTile
 */
class MyLakeWaterTile extends MyLakeTile {   
    constructor(scene, id, lilypad) {
        super(scene, id, lilypad);
    }

    display(){
        this.scene.pushMatrix();
            this.scene.scale(0.75, 1, 0.75);
            this.scene.translate(0, 0.01, 0);
            this.scene.rotate(Math.PI, 1, 0, 0);
            super.display();
        this.scene.popMatrix();
    }
}