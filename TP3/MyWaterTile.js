/**
 * MyWaterTile
 */
class MyWaterTile extends MyTile {   
    constructor(scene, id) {
        super(scene, id);

        let texture = new CGFtexture(scene, 'scenes/images/waterTile.jpg');
        this.material.setTexture(texture);

        this.highlightMaterial = new CGFappearance(this.scene);
        this.highlightMaterial.setAmbient(0.1, 0.5, 0.9, 1);
        this.highlightMaterial.setDiffuse(0.05, 0.25, 0.45, 1);
        this.highlightMaterial.setSpecular(0.1, 0.5, 0.9, 1);
        this.highlightMaterial.setShininess(5.0);    
        this.highlightMaterial.setTexture(texture);
        this.highlightMaterial.setTextureWrap('REPEAT', 'REPEAT');  
    }
}