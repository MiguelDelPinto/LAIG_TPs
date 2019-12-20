/**
* MyLake
*/
class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.water = new MyLakeWater(this.scene);
        this.frog = new MyFrog(this.scene, 'lake_frog');

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

            this.scene.pushMatrix();
                this.scene.translate(-0.8, 0.5, -0.65);
                this.scene.scale(0.4, 0.4, 0.4); 
                this.frog.display();   
            this.scene.popMatrix();

            this.scene.scale(1.5, 1.5, 1.5);
 
            // Cycles through the 8 rows
            for(let row = 0; row < 8; row++) {

                // Cycles through the 8 collumns
                for(let col = 0; col < 8; col++) {

                    // Calculates the index for tile selection
                    let index = row*8 + col;

                    // Displays the current tile
                    this.scene.pushMatrix();
                        this.scene.translate(-3.5 + row, 0, -3.5 + col);
                        this.scene.registerForPick(row*8+col+1, this.tiles[index]);
                        this.tiles[index].display();
                    this.scene.popMatrix();
                }
            }

        this.scene.popMatrix();
    }

    update(t){
        this.water.update(t);
    }

    updateTexCoords(length_s, length_t) {}
}