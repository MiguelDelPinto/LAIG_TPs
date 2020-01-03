/**
* LakeUndoButton
* @constructor
* @param scene - Reference to MyScene object
*/
class LakeUndoButton extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        
        this.lilypad = new MyLilyPad(scene, 'undo');
        
        this.undoMaterial = new CGFappearance(this.scene);
        this.undoMaterial.setAmbient(0.2, 0.4, 0.3, 1);
        this.undoMaterial.setDiffuse(0.2, 0.4, 0.3, 1);
        this.undoMaterial.setSpecular(0.02, 0.04, 0.03, 0.1);
        this.undoMaterial.setShininess(1.0);
        this.undoMaterial.loadTexture('scenes/images/undo.png');
		this.undoMaterial.setTextureWrap('REPEAT', 'REPEAT');

        this.lilypad.setMaterial(this.undoMaterial);

        this.plane = new MyPlane(scene, 15, 15);
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(0, 0.05, 0);
            this.scene.pushMatrix(); 
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.undoMaterial.apply();
                
                this.scene.translate(0, 0.01, 0);
                this.scene.scale(0.75, 0.75, 0.75);

                this.plane.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    updateTexCoords(length_s, length_t) {}
}