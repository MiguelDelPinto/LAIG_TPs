/**
* LakeFinishMoveButton
* @constructor
* @param scene - Reference to MyScene object
*/
class LakeFinishMoveButton extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.lilypad = new MyLilyPad(scene, 'finishMove');
        
        this.finishMoveMaterial = new CGFappearance(this.scene);
        this.finishMoveMaterial.setAmbient(0.2, 0.4, 0.3, 1);
        this.finishMoveMaterial.setDiffuse(0.2, 0.4, 0.3, 1);
        this.finishMoveMaterial.setSpecular(0.02, 0.04, 0.03, 0.1);
        this.finishMoveMaterial.setShininess(1.0);
        this.finishMoveMaterial.loadTexture('scenes/images/check.png');
		this.finishMoveMaterial.setTextureWrap('REPEAT', 'REPEAT');

        
        this.lilypad.setMaterial(this.finishMoveMaterial);

        this.plane = new MyPlane(scene, 15, 15);
    }

    display() {
        this.scene.pushMatrix(); 
            this.scene.translate(0, 0.05, 0);

            this.finishMoveMaterial.apply();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 0.01, 0);
                this.scene.scale(0.5, 0.5, 0.5);
                this.plane.display();
            this.scene.popMatrix();

        this.scene.popMatrix();
    }

    updateTexCoords(length_s, length_t) {}
}