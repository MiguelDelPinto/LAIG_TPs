/**
* FinishMoveButton
* @constructor
* @param scene - Reference to MyScene object
*/
class FinishMoveButton extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.buttonMaterial = new CGFappearance(this.scene);
        this.buttonMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.buttonMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
        this.buttonMaterial.setSpecular(0.3, 0.3, 0.3, 0.1);
        this.buttonMaterial.setShininess(1.0);
        
        this.finishMoveMaterial = new CGFappearance(this.scene);
        this.finishMoveMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.finishMoveMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
        this.finishMoveMaterial.setSpecular(0.3, 0.3, 0.3, 0.1);
        this.finishMoveMaterial.setShininess(1.0);
        this.finishMoveMaterial.loadTexture('scenes/images/check.png');
		this.finishMoveMaterial.setTextureWrap('REPEAT', 'REPEAT');

        this.plane = new MyPlane(scene, 15, 15);
    }

    display() {
        this.scene.pushMatrix(); 

            this.buttonMaterial.apply();
            this.scene.scale(1, 1, 1.5);

            this.scene.pushMatrix();
                this.plane.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.finishMoveMaterial.apply();
                this.plane.display();
            this.scene.popMatrix();


            this.buttonMaterial.apply();

            this.scene.pushMatrix();
                this.scene.translate(0, -0.1, 0.5);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(1, 1, 0.2);
                this.plane.display();
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.scene.translate(0, -0.1, -0.5);
                this.scene.rotate(-Math.PI/2, 1, 0, 0);
                this.scene.scale(1, 1, 0.2);
                this.plane.display();
            this.scene.popMatrix(); 


            this.scene.pushMatrix();
                this.scene.translate(-0.5, -0.1, 0);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.scale(0.2, 1, 1);
                this.plane.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0.5, -0.1, 0);
                this.scene.rotate(-Math.PI/2, 0, 0, 1);
                this.scene.scale(0.2, 1, 1);
                this.plane.display();
            this.scene.popMatrix();            

        this.scene.popMatrix();
    }

    updateTexCoords(length_s, length_t) {}
}