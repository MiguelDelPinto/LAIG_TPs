/**
 * MyRock
 */
class MyRock extends CGFobject {   
    constructor(scene, id) {
        super(scene);
 
        this.id = id;
        
        this.rock = new CGFOBJModel(this.scene, 'objects/rock.obj', false);

        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.2, 0.2, 0.2, 1);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(1.0);
        this.material.loadTexture('scenes/images/rock.jpg');
        this.material.setTextureWrap('REPEAT', 'REPEAT'); 

        this.highlighted = false;
    }

    display(){
        this.scene.pushMatrix();
            this.scene.translate(0, -0.3, 0);
            if(this.highlighted){
                this.highlightMaterial.apply();
            }else{
                this.material.apply();
            }
            this.rock.display();
        this.scene.popMatrix();
    }

    setHighlightMaterial(material){
        this.highlightMaterial = material;
    }

    highlight(){
        this.highlighted = true;
    }

    playDown(){
        this.highlighted = false;
    }
}