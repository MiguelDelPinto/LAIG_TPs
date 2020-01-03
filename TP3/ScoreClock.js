/**
* ScoreClock
* @constructor
* @param scene - Reference to MyScene object
*/
class ScoreClock extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.buttonMaterial = new CGFappearance(this.scene);
        this.buttonMaterial.setAmbient(0.2, 0.1, 0.0, 1);
        this.buttonMaterial.setDiffuse(0.2, 0.1, 0.0, 1);
        this.buttonMaterial.setSpecular(0.2, 0.1, 0.0, 0.1);
        this.buttonMaterial.setShininess(1.0);

        this.digitMaterial = new CGFappearance(this.scene);
        this.digitMaterial.setAmbient(0.0, 0.2, 0.7, 1);
        this.digitMaterial.setDiffuse(0.0, 0.2, 0.7, 1);
        this.digitMaterial.setSpecular(0.0, 0.2, 0.7, 0.1);
        this.digitMaterial.setShininess(1.0);
        
        this.plane = new MyPlane(scene, 15, 15);

        this.height = 0.25*Math.tan(Math.PI/3);

        this.triangle1 = new MyTriangle(scene, 0, 0, 0, 0.25, 0, 0, 0, this.height, 0);
        this.triangle2 = new MyTriangle(scene, 0, 0, 0, 0, this.height, 0, 0.25, 0, 0);

        this.createNumbers();

        this.score = "00-00";
        this.time = "05:00-05:00";
    }

    createNumbers(){
        this.numbers = [
            new Zero(this.scene),
            new One(this.scene),
            new Two(this.scene),
            new Three(this.scene),
            new Four(this.scene),
            new Five(this.scene),
            new Six(this.scene),
            new Seven(this.scene),
            new Eight(this.scene),
            new Nine(this.scene)
        ];

        this.separator = new Hexagon(this.scene);
    }

    display() {
        this.scene.pushMatrix(); 

            this.buttonMaterial.apply();
            this.scene.scale(1, 1, 2);

            this.scene.pushMatrix();
                this.scene.translate(0, -0.2, 0);
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.plane.display();
            this.scene.popMatrix();


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

            this.scene.pushMatrix();
                this.scene.scale(1, 2, 1);

                this.scene.pushMatrix();
                    this.scene.translate(0, this.height, 0);
                    this.scene.scale(0.5, 0.5, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(0.376, 0.215, 0);
                    this.scene.rotate(-Math.PI/3, 0, 0, 1);
                    this.scene.scale(0.5, 1, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(-0.376, 0.215, 0);
                    this.scene.rotate(Math.PI/3, 0, 0, 1);
                    this.scene.scale(0.5, 1, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.scale(0.5, 0.45, 1);
                    this.scene.translate(0, 0.5, 0.5);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(0.25, 0, 0.5);
                    this.triangle1.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(-0.25, 0, 0.5);
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    this.triangle2.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.rotate(Math.PI, 0, 1, 0);

                    this.scene.pushMatrix();
                        this.scene.scale(0.5, 0.45, 1);
                        this.scene.translate(0, 0.5, 0.5);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.plane.display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.25, 0, 0.5);
                        this.triangle1.display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.25, 0, 0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.triangle2.display();
                    this.scene.popMatrix();
                this.scene.popMatrix();


                this.digitMaterial.apply();

                this.scene.pushMatrix();

                    this.displayScore();
                    this.displayTime();

                this.scene.popMatrix();

            this.scene.popMatrix();    
        this.scene.popMatrix();
    }

    displayScore(){
        this.scene.pushMatrix();
            this.scene.translate(0.45, 0.125, 0.2);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[0])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.45, 0.125, 0.075);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[1])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.46, 0.085, -0.015);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.45, 0.125, -0.175);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[3])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.45, 0.125, -0.3);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[4])].display();
        this.scene.popMatrix();
    }

    displayTime(){
        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.4);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[0])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.3);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[1])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.31, 0.33, 0.26);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.35, 0.275, 0.26);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.15);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[3])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.05);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[4])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.45);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[10])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.35);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[9])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.31, 0.33, -0.25);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.35, 0.275, -0.25);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.2);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[7])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.1);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.time[6])].display();
        this.scene.popMatrix();
    }

    updateScore(player1Score, player2Score){
        this.score = "";
        if(player1Score < 10){
            this.score += String(0);
        }
        this.score += String(player1Score);
        
        this.score += "-";

        if(player2Score < 10){
            this.score += String(0);
        }
        this.score += String(player2Score);
    }

    updateTexCoords(length_s, length_t) {}
}