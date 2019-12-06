/**
* MyBoard
* @constructor
* @param scene - Reference to MyScene object
*/
class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Generates the tiles
        this.generateTiles();
    }

    generateTiles() {
        this.tiles = [];

        // Cycles from row 'a' (char code 97) to 'h' (char code 103), that is, 8 total rows
        for(let row = 97; row <= 103; row++) {

            // Cycles from collumn 1 to 8
            for(let col = 1; col <= 8; col++) {
                
                // If it's on one of the edge rows/collumns, creates a water tile
                if(String.fromCharCode(row) === 'a' || String.fromCharCode(row) === 'h' || col === 1 || col === 8) {
                    this.tiles.push(new MyWaterTile(this.scene, "tile_" + String.fromCharCode(row) + col));                    
                }   
                // Otherwise, just a normal tile             
                else  {
                    this.tiles.push(new MyWaterTile(this.scene, "tile_" + String.fromCharCode(row) + col));                    
                }

            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        
        // Cycles through the 8 rows
        for(let row = 0; row < 8; row++) {

            // Cycles through the 8 collumns
            for(let col = 0; col < 8; col++) {

                // Calculates the index for tile selection
                let index = row*8 + col;

                // Displays the current tile
                this.scene.pushMatrix();
                    this.tiles[index].display();
                this.scene.popMatrix();
            }
        }
    }

    updateTexCoords(length_s, length_t) {}
}