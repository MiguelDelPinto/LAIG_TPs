/**
 * MyWaterTile
 */
class MyWaterTile extends MyTile {   
    constructor(scene, id) {
        super(scene, id);

        let texture = new CGFtexture(scene, 'scenes/images/waterTile.jpg');
        this.material.setTexture(texture);
    }
}