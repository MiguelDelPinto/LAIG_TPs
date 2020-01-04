/**
* Menu
* @constructor
* @param scene - Reference to MyScene object
*/
class Menu extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.plane = new MyPlane(scene, 15, 15);

        this.frog = new MyFrog(scene);

        this.initMaterials();
        this.initMusic();
    }

    initMusic(){
        this.background_music = new Audio('audio/chess.mp3');
        this.background_music.loop = true;
        this.background_music.volume = 0.25;
        this.background_music.autoplay = true;
    }

    initMaterials(){
        this.frog_chess_material = new CGFappearance(this.scene);
        this.frog_chess_material.setAmbient(0.2, 0.2, 0.2, 1);
        this.frog_chess_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.frog_chess_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.frog_chess_material.setShininess(1.0);
        this.frog_chess_material.loadTexture('scenes/images/frog_chess.png');
        this.frog_chess_material.setTextureWrap('REPEAT', 'REPEAT'); 

        this.play_material = new CGFappearance(this.scene);
        this.play_material.setAmbient(0.2, 0.2, 0.2, 1);
        this.play_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.play_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.play_material.setShininess(1.0);
        this.play_material.loadTexture('scenes/images/play.png');
        this.play_material.setTextureWrap('REPEAT', 'REPEAT'); 
        
        this.options_material = new CGFappearance(this.scene);
        this.options_material.setAmbient(0.2, 0.2, 0.2, 1);
        this.options_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.options_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.options_material.setShininess(1.0);
        this.options_material.loadTexture('scenes/images/options.png');
        this.options_material.setTextureWrap('REPEAT', 'REPEAT'); 
        
        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(0.5, 0.5, 0.125, 1);
        this.yellowMaterial.setDiffuse(0.5, 0.5, 0.125, 1);
        this.yellowMaterial.setSpecular(0.1, 0.1, 0.025, 0.1);
        this.yellowMaterial.setShininess(1.0);
           
        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0.125, 0.5, 0.5, 1);
        this.blueMaterial.setDiffuse(0.125, 0.5, 0.5, 1);
        this.blueMaterial.setSpecular(0.025, 0.1, 0.1, 0.1);
        this.blueMaterial.setShininess(1.0);

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.2, 0.2, 0.2, 1);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(1.0);

    }

    display() {
        //FROG CHESS NAME
        this.scene.pushMatrix();
            this.frog_chess_material.apply();
            this.scene.translate(0, 2.5, 0);
            this.scene.scale(2, 2, 2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.plane.display();
        this.scene.popMatrix();


        //Play Button
        this.scene.pushMatrix();
            this.scene.translate(0, 0.25, 0);
            this.scene.scale(2, 0.8, 1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            
            this.material.apply();
            this.plane.display();

            this.play_material.apply();
            this.plane.display();
        this.scene.popMatrix();

        //Options Button
        this.scene.pushMatrix();
            this.scene.translate(0, -1, 0);
            this.scene.scale(2, 0.8, 1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.material.apply();
            this.plane.display();

            this.options_material.apply();
            this.plane.display();
        this.scene.popMatrix();

        //Board Button
        this.scene.pushMatrix();
            this.scene.translate(-2.75, 0, 2);
            this.scene.scale(2, 1, 1);
            this.scene.rotate(-Math.PI/64, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.material.apply();
            this.plane.display();
        this.scene.popMatrix();

        //Lake Button
        this.scene.pushMatrix();
            this.scene.translate(2.75, 0, 2);
            this.scene.scale(2, 1, 1);
            this.scene.rotate(Math.PI/64, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.material.apply();
            this.plane.display();
        this.scene.popMatrix();

        //Frog
        this.scene.pushMatrix();
            this.scene.translate(3, -3, 2);
            this.scene.scale(0.5, 0.5, 0.5);
            this.scene.rotate(Math.PI/8, 1, 0, 0);
            this.scene.rotate(-Math.PI/3, 0, 1, 0);
            this.yellowMaterial.apply();
            this.frog.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-3, -3, 2);
            this.scene.scale(0.5, 0.5, 0.5);
            this.scene.rotate(Math.PI/8, 1, 0, 0);
            this.scene.rotate(Math.PI/3, 0, 1, 0);
            this.blueMaterial.apply();
            this.frog.display();
        this.scene.popMatrix();
    }

    update(t){

    }

    updateTexCoords(length_s, length_t) {}
}