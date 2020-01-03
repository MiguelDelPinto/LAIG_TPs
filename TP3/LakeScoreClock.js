/**
* LakeScoreClock
* @constructor
* @param scene - Reference to MyScene object
*/
class LakeScoreClock extends ScoreClock {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        
        this.lilypad = new MyLilyPad(this.scene, 'clock');
    }

    display() {
        this.scene.pushMatrix(); 
            
            this.scene.scale(1, 1, 0.75);

            this.scene.pushMatrix();
            
                this.digitMaterial.apply();

                this.scene.pushMatrix();
                    this.scene.scale(0.8, 0.8, 0.8);
                    this.displayScore();
                    this.displayTime();

                this.scene.popMatrix();

            this.scene.popMatrix();    
        this.scene.popMatrix();
    }

    displayScore(){
        this.scene.pushMatrix();

            this.scene.translate(-0.05, 0.1, 2.75);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.score[0])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-0.05, 0.1, 1.25);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.score[1])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-0.05, 0.1, 0);
            this.scene.scale(0.6, 0.6, 0.6);

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(0.1, 0.1, 0);
                this.scene.scale(0.15, 0.15, 0.15);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-0.05, 0.1, -1.25);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.score[3])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-0.05, 0.1, -2.75);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.score[4])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    displayTime(){
        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, 5.5);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[0])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, 4.1);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[1])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();

            this.scene.translate(-2.3, 0.1, 3.2);
            this.scene.scale(0.4, 0.4, 0.4);

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(0.1, 0.1, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-1.5, 0.1, 3.2);
            this.scene.scale(0.4, 0.4, 0.4);

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(0.1, 0.1, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, 2.2);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[3])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, 0.8);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[4])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, -5.5);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[10])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, -4.1);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[9])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();

            this.scene.translate(-2.3, 0.1, -3.1);
            this.scene.scale(0.4, 0.4, 0.4);

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(0.1, 0.1, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-1.5, 0.1, -3.1);
            this.scene.scale(0.4, 0.4, 0.4);

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(0.1, 0.1, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, -2.2);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[7])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(-2, 0.1, -0.8);


            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.lilypad.display();
            this.scene.popMatrix();

            this.digitMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-0.1, 0.01, 0);
                this.scene.scale(0.1, 0.1, 0.1);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.numbers[Number(this.time[6])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
}