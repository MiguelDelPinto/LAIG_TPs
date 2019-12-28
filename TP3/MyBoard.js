/**
* MyBoard
* @constructor
* @param scene - Reference to MyScene object
*/
class MyBoard extends CGFobject {
    constructor(scene, piece, transformationMatrix) {
        super(scene);
        this.scene = scene;

        this.transformationMatrix = transformationMatrix || mat4.create();

        this.loaded = false;

        // Generates the tiles
        this.generateTiles();

        // Generates the borders of the board
        this.generateBorders();

        // Generates the pieces
        this.generatePieces(piece);

        this.loaded = true;
    }

    generateTiles() {
        this.tiles = [];

        // Cycles from row 'a' (char code 97) to 'h' (char code 103), that is, 8 total rows
        for(let row = 97; row <= 104; row++) {

            // Cycles from collumn 1 to 8
            for(let col = 1; col <= 8; col++) {
                
                // If it's on one of the edge rows/collumns, creates a water tile
                if(String.fromCharCode(row) === 'a' || String.fromCharCode(row) === 'h' || col === 1 || col === 8) {
                    this.tiles.push(new MyWaterTile(this.scene, "tile_" + String.fromCharCode(row) + col));                    
                }   
                // Otherwise, just a normal tile             
                else  {
                    this.tiles.push(new MyTile(this.scene, "tile_" + String.fromCharCode(row) + col));                    
                }

            }
        }
    }

    generateBorders() {
        this.border_side = new MyRectangle(this.scene, 'border_side', -4, -0.5, 4, 0);
    }

    generatePieces(piece) {
        this.piece = piece || new MyPiece(this.scene, 'piece');
        
        this.generatePieceMaterials();

        // Array that stores the pieces in the board
        this.pieces = [];

        for(let row = 1; row <= 8; row++) {

            let row_of_pieces = [];
            for(let col = 1; col <= 8; col++) {

                row_of_pieces.push("empty");
            }

            this.pieces.push(row_of_pieces);
        }
    }

    generatePieceMaterials(){
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
    }

    display() {
        //Display Board
        this.scene.pushMatrix();
            this.scene.multMatrix(this.transformationMatrix);

            this.scene.pushMatrix();
                this.scene.scale(0.5, 1, 0.5);
            
                this.displayTiles();

                this.displayBorders();

                this.displayPieces();

            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    displayTiles(){
        // Cycles through the 8 rows
        for(let row = 0; row < 8; row++) {

            // Cycles through the 8 collumns
            for(let col = 0; col < 8; col++) {

                // Calculates the index for tile selection
                let index = row*8 + col;

                // Displays the current tile
                this.scene.pushMatrix();
                    this.scene.translate(-3.5 + row, 0, -3.5 + col);
                    if(this.tiles[index].isHighlighted()){
                        this.scene.registerForPick(index+1, this.tiles[index]);
                    }
                    
                    this.tiles[index].display();
                    
                    this.scene.clearPickRegistration();
                this.scene.popMatrix();
            }
        }
    }

    displayBorders(){
        // Displays the borders
        this.scene.pushMatrix();   
            this.scene.pushMatrix();
                this.scene.translate(5.15, -0.16, -4);
                this.scene.scale(2.2875, 0.04, 1);
                this.border_side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-5.15, -0.16, 4);
                this.scene.scale(2.2875, 0.04, 1);
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.border_side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-4, -0.16, -5.15);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.scene.scale(2.2875, 0.04, 1);
                this.border_side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(4, -0.16, 5.15);
                this.scene.rotate(-Math.PI/2, 0, 1, 0);
                this.scene.scale(2.2875, 0.04, 1);
                this.border_side.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    displayPieces(){
        for(let row = 0; row < 8; row++) {

            // Cycles through the 8 collumns
            for(let col = 0; col < 8; col++) {

                // Calculates the index for piece selection
                //let index = row*8 + col;

                // Displays the current 
                this.scene.pushMatrix();
                    this.displayPiece(row, col);    
                this.scene.popMatrix();
            }
        }
    }

    displayPiece(row, column){     
        this.pieceTransformation(row, column);

        switch(this.pieces[row][column]){
            case "yellow":
                this.yellowMaterial.apply();
                break;
            case "blue":
                this.blueMaterial.apply();

                this.scene.translate(0, 0, -0.4);
                this.scene.rotate(Math.PI, 0, 1, 0);
                
                break;
            default:
                return;
        }

        //this.scene.registerForPick(100+row*8+column+1, this.piece);
        this.piece.display();
    }
    
    pieceTransformation(row, column){
        this.scene.translate(-3.5 + row, 0, -3.4 + column);
        this.scene.scale(0.45, 0.45, 0.45);
    }

    getPieces(){
        return this.pieces;
    }

    setPieces(pieces){
        this.pieces = pieces; 
    }

    setPiecePosition(position, color){
        this.pieces[position[0]][position[1]] = color;
    }

    setTransformationMatrix(transformationMatrix){
        this.transformationMatrix = transformationMatrix;
    }
    
    highlightTiles(positions){
        positions.forEach(position => {
            this.tiles[position[0]*8 + position[1]].highlight();
        });
    }

    playDownTiles(){
        this.tiles.forEach(tile => {
            tile.playDown();
        });
    }

    update(t){
        this.piece.update(t);
    }

    updateTexCoords(length_s, length_t) {}
}