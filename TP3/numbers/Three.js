/**
 * Three
 */
class Three extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.hexagon = new Hexagon(scene);
    }

    display(){
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.scene.translate(-1.25, 1.25, 0);
                this.hexagon.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.hexagon.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-1.25, -1.25, 0);
                this.hexagon.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, -2.5, 0);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.hexagon.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-1.25, -3.75, 0);
                this.hexagon.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

	updateTexCoords(length_s, length_t) {}
}
