/**
 * MyTile
 */
class MyTile extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;
        
        this.highlighted = false;

        this.plane = new MyPlane(scene, 15, 15);

        this.generateMaterials();
    }

    generateMaterials(){
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.9, 0.9, 0.9, 1);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.material.loadTexture('scenes/images/tile.jpg');
        this.material.setTextureWrap('REPEAT', 'REPEAT');      

        this.highlightMaterial = new CGFappearance(this.scene);
        this.highlightMaterial.setAmbient(0.1, 0.9, 0.5, 1);
        this.highlightMaterial.setDiffuse(0.05, 0.45, 0.25, 1);
        this.highlightMaterial.setSpecular(0.1, 0.9, 0.5, 1);
        this.highlightMaterial.setShininess(5.0);    
    }

    display(){
        if(this.highlighted){
            this.highlightMaterial.apply();
        }else{
            this.material.apply();
        }
        
        this.plane.display();
    }

    highlight(){
        this.highlighted = true;
    }
    
    playDown(){
        this.highlighted = false;
    }
}