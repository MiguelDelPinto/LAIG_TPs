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

        this.undo_button = new MyUndoButton(scene);
        this.check_button = new FinishMoveButton(scene);
        this.clock = new ScoreClock(scene);

        this.canDisplayCheck = false;

        // Generates the tiles
        this.generateTiles();

        // Generates the borders of the board
        this.generateBorders();

        // Generates the pieces
        this.generatePieces(piece);

        this.loaded = true;

        this.movingPiece = null;

        this.maxHeight = 2;

        this.initMusic();
    }

    initMusic(){
        this.background_music = new Audio('audio/chess.mp3');
        this.background_music.loop = true;
        this.background_music.volume = 0.25;
        this.background_music.autoplay = true;
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
        this.piece = piece || new MyFrog(this.scene, 'frog');
        
        this.generatePieceMaterials();

        // Array that stores the pieces in the board
        this.pieces = [];
        this.realPieces = [];

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

                this.displayUndoButton();

                this.displayCheckButton();

                this.displayClock();

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
        this.realPieces.forEach(piece => {
            if(!piece.isInvisible()){
                this.scene.pushMatrix();
                    this.displayPiece(piece);
                this.scene.popMatrix();
            }
        });
    }

    displayPiece(piece){     
        this.pieceTransformation(piece.getRow(), piece.getColumn());

        if(this.pieces[piece.getRow()][piece.getColumn()] === "blue"){
            this.scene.translate(0, 0, -0.4);
            this.scene.rotate(Math.PI, 0, 1, 0);
        }

        if(piece.canBePicked()){
            this.scene.registerForPick(100+piece.getRow()*8+piece.getColumn()+1, piece);
        }

        piece.display(this.pieceScale());
        
        this.scene.clearPickRegistration();
    }

    displayUndoButton() {
        this.scene.pushMatrix();
            this.scene.translate(-5, 0, -1);
            this.scene.registerForPick(420, this.undo_button);
            this.undo_button.display();
            this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }

    displayClock(){
        this.scene.pushMatrix();
            this.scene.translate(5, 0, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.scale(1, 0.75, 1.5);
            this.clock.display();
            this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }

    enableDisplayCheck(){
        this.canDisplayCheck = true;
    }

    disableDisplayCheck(){
        this.canDisplayCheck = false;
    }

    displayCheckButton(){
        if(!this.canDisplayCheck)
            return;
            
        this.scene.pushMatrix();
            this.scene.translate(-5, 0, 1);
            this.scene.registerForPick(501, this.check_button);
            this.check_button.display();
            this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }
    
    pieceTransformation(row, column){
        this.scene.translate(-3.5 + row, 0, -3.4 + column);
        this.scene.scale(...this.pieceScale());
    }

    pieceScale(){
        return [0.45, 0.45, 0.45];
    }

    getMaterial(color){
        switch(color){
            case "yellow":
                return this.yellowMaterial;
            case "blue":
                return this.blueMaterial;
            default:
                console.log("ERROR: Color does not exist\n\n");
                return null;
        }
    }

    getPieces(){
        return this.pieces;
    }

    setPieces(pieces){
        this.pieces = pieces; 
    }

    setPiecePosition(position, color){
        this.pieces[position[0]][position[1]] = color; //Prolog board

        this.realPieces.push(new MyPiece(this.scene,               //scene 
                                         position[0]*8+position[1],  //id
                                         this.piece,               //piece
                                         position[0],              //row
                                         position[1],              //column
                                         this.getMaterial(color),
                                         color)       //material
                            );

        this.updateScore();
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
        this.realPieces.forEach(piece => {
            piece.update(t);
        });

        this.clock.update(t);
    }

    getNumberPlayerPieces(playerColor){
        
        let numberPieces = 0;

        this.realPieces.forEach(piece =>{
            if(!piece.isInvisible()){
                if(piece.getColor() === playerColor){
                    numberPieces++;
                }
            }
        });

        return numberPieces;
    }

    selectPieces(positions){
        positions.forEach(position => {
            this.realPieces.forEach(piece =>{
                if(!piece.isInvisible()){
                    let Break = {};
                    try{
                        if(piece.getRow() === position[0] && piece.getColumn() === position[1]){
                            piece.enablePicking();
                            throw Break;
                        }
                    }catch(e){} //Break forEach loop
                }
            });
        });
    }

    deselectPieces(){
        this.realPieces.forEach(piece =>{
            piece.disablePicking();
        });
    }

    selectPiece(row, column){
        const Break = {};

        try{
            this.realPieces.forEach(piece => {
                if(!piece.isInvisible()){
                    if(piece.getRow() === row && piece.getColumn() === column){
                        piece.select();
                        this.movingPiece = piece;
                        throw Break; //Force loop break
                    }
                }
            });
        }catch(e){}
    }

    deselectPiece(row, column){
        const Break = {};

        try{
            this.realPieces.forEach(piece => {
                if(!piece.isInvisible()){
                    if(piece.getRow() === row && piece.getColumn() === column){
                        piece.deselect();
                        this.movingPiece = null;
                        throw Break; //Force loop break
                    }
                }
            });
        }catch(e){}
    }

    movePiece(start, end){
        const Break = {};

        try{
            this.realPieces.forEach(piece => {
                if(!piece.isInvisible()){
                    if(piece.getRow() === start[0] && piece.getColumn() === start[1]){
                        piece.move(start, end, this.maxHeight);
                        this.movingPiece = piece;
                        throw Break; //Force loop break
                    }
                }
            });
        }catch(e){}
    }


    reactivatePiece(start){
        const Break = {};

        try{
            this.realPieces.forEach(piece => {
                if(piece.isInvisible()){
                    if(piece.getRow() === start[0] && piece.getColumn() === start[1]){
                        console.log("VISIVEL");
                        piece.makeVisible();
                        throw Break; //Force loop break
                    }
                }
            });
        }catch(e){}
    }

    getMovingPiece(){
        return this.movingPiece;
    }

    finishPieceMove(){
        this.movingPiece = null;
    }

    makePieceInvisible(row, column){
        this.realPieces.forEach(piece => {
            if(piece.getRow() === row && piece.getColumn() === column){
                piece.makeInvisible();
                piece.deselect();
                return;
            }
        });

        this.updateScore();
    }

    getMaxHeight(){
        return this.maxHeight;
    }

    removeOuterFrogs(){
        let aux1 = 0, aux2 = 7; 

        for(let column = 0; column < 8; column++){
            if(this.pieces[aux1][column] !== "empty"){
                this.pieces[aux1][column] = "empty";
                this.makePieceInvisible(aux1, column);
            }  
            if(this.pieces[aux2][column] !== "empty"){
                this.pieces[aux2][column] = "empty";
                this.makePieceInvisible(aux2, column);
            }
        }

        for(let row = 0; row < 8; row++){
            if(this.pieces[row][aux1] !== "empty"){
                this.pieces[row][aux1] = "empty";
                this.makePieceInvisible(row, aux1);
            }  
            if(this.pieces[row][aux2] !== "empty"){
                this.pieces[row][aux2] = "empty";
                this.makePieceInvisible(row, aux2);
            }
        }
    }

    updateScore(){
        let player1Score = 0, player2Score = 0;

        this.realPieces.forEach(piece =>{
            if(!piece.isInvisible()){
                if(piece.getColor() === "blue"){
                    player1Score++;
                }
                else if(piece.getColor() === "yellow"){
                    player2Score++;
                }
            }
        });

        this.clock.updateScore(player2Score, player1Score);
    }

    updateTime(t, player){
        const finishGame = this.clock.updateTime(t, player);
        if(finishGame){
            return true;
        }
    }

    updateTexCoords(length_s, length_t) {}
}