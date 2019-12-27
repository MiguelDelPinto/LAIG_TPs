/**
* MyLake
*/
class MyLake extends MyBoard {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.water = new MyLakeWater(this.scene);
        //this.frog = new MyFrog(this.scene, 'lake_frog');
        this.frogAnimation = new JumpAnimation(x => {
            return 2 - 8*Math.pow(x - 0.5, 2);
        }, 1000, [4, 4], [4, 6]);

        // Generates the tiles
        this.generateTiles();
    }

    generateTiles() {
        this.tiles = [];

        this.rock = new MyRock(this.scene, 'rock');
        this.lilypad = new MyLilyPad(this.scene, 'lilypad');

        // Cycles from row 'a' (char code 97) to 'h' (char code 103), that is, 8 total rows
        for(let row = 97; row <= 104; row++) {

            // Cycles from collumn 1 to 8
            for(let col = 1; col <= 8; col++) {
                
                // If it's on one of the edge rows/collumns, creates a water tile
                if(String.fromCharCode(row) === 'a' || String.fromCharCode(row) === 'h' || col === 1 || col === 8) {
                    this.tiles.push(new MyLakeWaterTile(this.scene, "lake_tile_" + String.fromCharCode(row) + col, this.lilypad));                    
                }   
                // Otherwise, just a normal tile             
                else  {
                    this.tiles.push(new MyLakeTile(this.scene, "lake_tile_" + String.fromCharCode(row) + col, this.rock));                    
                }

            }
        }
    }

    display() {
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.scene.scale(29, 1, 29);
                this.water.display();
            this.scene.popMatrix();

            /*this.scene.pushMatrix();
                this.frogAnimation.apply(this.scene); 
                this.scene.translate(-0.8, 0.15, -0.65);
                this.scene.scale(0.4, 0.4, 0.4); 
                this.frog.display();   
            this.scene.popMatrix();*/

            this.scene.scale(1.5, 1.5, 1.5);
            
            super.display();

        this.scene.popMatrix();
    }

    displayBorders(){} //In the lake, the board doesn't have borders 

    pieceTransformation(row, column){
        this.scene.translate(-3.5 + row, 0.08, -3.45 + column);
        this.scene.scale(0.25, 0.25, 0.25);
    }

    update(t){ //Animations
        /**
         * TODO Change Animation: only needed when a move occurs  
         */ 
        this.water.update(t);
        this.frogAnimation.update(t);
        if(this.frogAnimation.getElapsedTime() > this.frogAnimation.getTotalTime()){
            this.frogAnimation.resetsTime();
            this.frogAnimation.finishAnimation = false;
        }
    }

    updateTexCoords(length_s, length_t) {}
}