/**
 * Hexagon
 */
class Hexagon extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.rectangle = new MyRectangle(scene, 'rectangle', -1, 1, -0.25, 0.25);
        this.triangle = new MyTriangle(scene, -1, -0.25, 0, -1, 0.25, 0, -1.25, 0, 0);
	}

    display(){
        this.rectangle.display();

        this.triangle.display();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.triangle.display();
        this.scene.popMatrix();
    }

	updateTexCoords(length_s, length_t) {}
}
