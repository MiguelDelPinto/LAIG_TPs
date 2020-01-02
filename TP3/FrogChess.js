/**
 * FrogChess
 * @constructor
 * @param scene - Reference to MyScene object
 */
class FrogChess extends CGFobject {
    constructor(scene, board, gameMode) {
        super(scene);
        this.scene = scene;

        // TODO this.board = board;   (passes from menu, could be a lake or normal board)

        this.board = board || new MyBoard(scene);
        
        this.player = 1; //First Player is the player 1

        this.level = 1; // TODO Add variable levels
        
        this.gameMode = gameMode || 2;

        this.fillingBoard = true; //In the beggining of the game, players have to fill the board with frogs

        this.wait = 20;

        //If serverCall is true, there was a call to the server and no other call will be made 
        this.serverCall = false;

        //Checking if the player is picking any tile
        this.isPicking = false;

        //Stack that holds all of the moves played
        this.moves = [];

        //CPU Move Variables
        this.cpuIsMoving = false;
        this.move = null;
        this.jump_pos_from = null;

        //Player Move Variables
        this.playerStartMoving = false;
        this.playerFrogs = null;

        //Game Over Boolean
        this.gameOver = false;
    }

    updateWait() {
        if(this.wait > 0) {
            this.wait--;
            return 1;
        }
        else {
            this.wait = 20;
            return 0;
        }
    }

    getPlayerColor(){
        if(this.player == 1)
            return "blue";
        
        return "yellow";
    }

    nextPlayer(){
        this.player = (this.player+2) % 2 + 1;
    }

    startMove(pos_from){
        this.jump_pos_from = this.board.pieces[pos_from[0]][pos_from[1]];
        this.board.pieces[pos_from[0]][pos_from[1]] = "empty";
    }

    finishMove(pos_from, pos_to) {
        let pos_middle = [];

        if(pos_from[0] > pos_to[0]) {
            pos_middle.push(pos_from[0] - 1);
        }
        else if(pos_from[0] < pos_to[0]) {
            pos_middle.push(pos_from[0] + 1);
        }
        else {
            pos_middle.push(pos_from[0]);
        }

        if(pos_from[1] > pos_to[1]) {
            pos_middle.push(pos_from[1] - 1);
        }
        else if(pos_from[1] < pos_to[1]) {
            pos_middle.push(pos_from[1] + 1);
        }
        else {
            pos_middle.push(pos_from[1]);
        }        

        this.board.pieces[pos_to[0]][pos_to[1]] = this.jump_pos_from;
        this.jump_pos_from = null;
        this.board.pieces[pos_middle[0]][pos_middle[1]] = "empty"; 
        
        this.board.makePieceInvisible(...pos_middle); //Deletes piece from the board
    }

    undoCPUMove() {
        if(this.moves.length > 0) {

            let move = this.moves.pop();

            // Undo a CPU move
            if(move[0] === 'CPU') {
                let color = move[1];
                let to = move[1];
                let from = move[2];
            }
            // Undo a Human move
            else {
            
            }
        }
    }


    // ---------- GAME LOGIC -----------

    // CPU chooses a fill position, in the beginning of the game
    chooseFillPosition() {
        if(!this.serverCall){
            this.serverCall = true;
            serverCpuFillChoose(this.board.getPieces(), data => this.handleFillPosition(data));
        }        

    }

    // Generates possible fill positions
    getFillPositions() {
        if(!this.serverCall){
            serverValidFillPositions(this.board.getPieces(), data => this.handleFillPositions(data));
            this.serverCall = true;
        }
    }

    // CPU chooses a jump position
    chooseJumpPosition() {
        if(!this.serverCall){
            serverChooseBestMove(this.board.getPieces(), this.player, this.level, data => this.handleCPUMove(data));
            this.serverCall = true;
        }   
    }

    getPlayerFrogs() {
        if(!this.serverCall){
            serverGetPlayerFrogs(this.board.getPieces(), this.player, data => this.handlePlayerFrogs(data));
        }
    }

    //Check Game Over
    checkGameOver(){
        if(!this.serverCall){
            serverCheckGameOver(this.board.getPieces(), this.player, data => this.handleGameOver(data));
        }
    }

    // Generates possible jump positions
    /*getValidJumpPosition(position) { 
        if(!this.serverCall){
            serverValidJumpPosition(this.board.getPieces(), position, data => this.handleValidJumpPosition(position, data));
            this.serverCall = true;
        }
    }*/

    // Generates all valid moves
    getValidMoves(position) {
        if(!this.serverCall){
            serverValidMoves(this.board.getPieces(), this.player, data => this.handleValidMoves(position, data));
        }
    }

    // ---------- REQUEST HANDLERS -----------

    // Handles a newly generated fill position [x, y] from the request
    handleFillPosition(data) {
        let position = JSON.parse(data.target.response);

        if(position === undefined) {
            console.log("ERROR: choosing fill position");
            this.serverCall = false;
            return;
        }

        if(Array.isArray(position) && !position.length) {
            this.fillingBoard = false;
            this.serverCall = false;
            return;
        }

        this.board.setPiecePosition(position, this.getPlayerColor());
        this.nextPlayer();

        this.serverCall = false;
    }

    // Handles an array with all the available fill positions [x, y] from the request
    handleFillPositions(data) {
        let positions = JSON.parse(data.target.response);

        if(positions === undefined) {
            console.log("ERROR: getting fill positions");
            this.serverCall = false;
            return;
        }

        if(Array.isArray(positions) && !positions.length) {
            this.fillingBoard = false;
            this.serverCall = false;
            return;
        }

        this.board.highlightTiles(positions);

        this.serverCall = false;
        this.isPicking = true;
    }

    // Handles an array with all the positions [x, y] of the player frogs from the request
    handlePlayerFrogs(data){
        let frogPositions = JSON.parse(data.target.response);

        if(frogPositions === undefined){
            console.log("ERROR: getting player frogs");
            this.serverCall = false;
            return;
        }

        if(Array.isArray(frogPositions) && !frogPositions.length){ //Player can't move -> GAME OVER
            this.serverCall = false;
            return;
        }

        this.playerFrogs = frogPositions;
        this.board.selectPieces(frogPositions);
        this.serverCall = false;
        this.isPicking = true;
    }

    // Handles a position [x, y] from the request
    /*handleValidJumpPosition(position, data){
        let finalPosition = JSON.parse(data.target.response);

        if(finalPosition === undefined){
            console.log("ERROR: getting valid jump position");
            this.serverCall = false;
            return;
        }
        
        this.serverCall = false;


        if(Array.isArray(finalPosition) && !finalPosition.length){ // Selected frog can't jump        
            console.log("Deselected Piece");
            this.board.deselectPiece(...position);    
            this.isPicking = true;
        }
    }*/

    // Handles an array with all possible moves of the player
    handleValidMoves(position, data) {
        let moves = JSON.parse(data.target.response);

        if(moves === undefined){
            console.log("ERROR: getting valid moves");
            this.serverCall = false;
            return;
        }

        if(Array.isArray(moves) && !moves.length){ // Player lost the game
            this.serverCall = false;
            return;
        }

        let foundValidMove = false;
        let validMoveTiles = [];

        moves.forEach(move => { //move is a list of positions
            const firstPosition = move[0];
            if(firstPosition[0] === position[0] && firstPosition[1] === position[1]){ //Found Valid Move From Position
                foundValidMove = true;
                validMoveTiles.push(move[1]);
            }
        });

        if(!foundValidMove){
            if(this.playerStartMoving){
                this.board.removeOuterFrogs();
                this.checkGameOver();
                this.board.finishPieceMove();
                this.selectedPiece = false;
                this.playerStartMoving = false;
                this.nextPlayer();
                this.isPicking = false;
            }else{
                this.board.deselectPiece(position[0], position[1]);    
                this.isPicking = true;
            }
        }else{
            this.board.playDownTiles();
            this.board.highlightTiles(validMoveTiles);
            this.isPicking = true;
        }
    }

    // Handles a newly generated move(array of positions [x, y]) from the request
    handleCPUMove(data) {

        let jumps = JSON.parse(data.target.response);

        if(jumps === undefined) {
            console.log("ERROR: choosing jump position");
            this.serverCall = false;
            return;            
        }

        if(Array.isArray(jumps) && !jumps.length) {
            console.log("ERROR: no valid moves");
            this.serverCall = false;
            return;
        }

        this.cpuIsMoving = true;
        this.move = jumps;

        this.board.movePiece(this.move[0], this.move[1]);
        this.startMove(this.move[0]);

        this.nextPlayer();
        this.serverCall = false;
    }

    handleGameOver(data){
        let winner = JSON.parse(data.target.response);

        if(winner === undefined){
            console.log("ERROR: check game over");
            this.serverCall = false;
            return;
        }

        if(winner === 0){ //No one won the game yet
            return;
        }

        console.log("CONGRATULATIONS PLAYER " + winner + " FOR WINNING THE GAME!!!!");
        this.gameOver = true;
        this.serverCall = false;
    }
    
    // Parses a position [x, y] from the request
    handlePosition(data) {
        let position = JSON.parse(data.target.response);
        this.next_position = position;
        console.log(this.next_position);
    }

    // Parses an array of positions [ [x,y], [x, y], ...] from the request
    handlePositionArray(data) {
        let positions = JSON.parse(data.target.response);
        this.valid_positions = positions;
        console.log(positions);
    }

    // Parses a board [ [piece, ...], [piece, ...], ... ] from the request
    handleBoard(data) {
        let board = JSON.parse(data.target.response);
        this.next_board = board;
        console.log(board);
    }


    // ---------- PICKING -----------

    pickResults() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        let index = this.scene.pickResults[i][1] - 1; 
                        
                        if(index === 419)
                            continue;
                            
                        if(this.isPicking){
                            if(this.fillingBoard){ // Filling Board
                                console.log("Picked object: " + obj + ", with pick id " + index);	
                            
                                this.board.setPiecePosition([Math.trunc(index / 8), index % 8], this.getPlayerColor());
                                this.nextPlayer();				 
                                this.board.playDownTiles();
                            }else{ // Game
                               
                                if(!this.playerStartMoving){
                                    
                                    if(index >= 100){ //Frog index starts at 101
                                        console.log("Picked frog: " + obj + ", with pick id " + index);	
                                        
                                        index -= 100;

                                        const position = [Math.trunc(index / 8), index % 8];

                                        const movingPiece = this.board.getMovingPiece();
                                        if(movingPiece !== null && movingPiece !== undefined){
                                            this.board.playDownTiles();
                                            movingPiece.deselect();
                                            this.board.finishPieceMove();
                                        }

                                        this.board.selectPiece(...position);
                                        this.selectedPiece = true;
                                        this.getValidMoves(position);
                                    }else{
                                        console.log("Picked tile: " + obj + ", with pick id " + index);	

                                        const position = [Math.trunc(index / 8), index % 8]; //Get final jump position

                                        const movingPiece = this.board.getMovingPiece();
                                        if(movingPiece === null || movingPiece === undefined) //Can't move if no piece is selected
                                            break;

                                        this.move = [
                                            [movingPiece.getRow(), movingPiece.getColumn()],
                                            position
                                        ];
                                        
                                        this.playerStartMoving = true;

                                        this.board.playDownTiles();
                                        this.board.highlightTiles([this.move[1]]);
                                        this.board.deselectPieces();
                                        this.startMove(this.move[0]);
                                        this.board.movePiece(this.move[0], this.move[1]);
                                    }                                    
                                }else{
                                        console.log("Picked tile: " + obj + ", with pick id " + index);	
                                        
                                        const position = [Math.trunc(index / 8), index % 8]; //Get final jump position

                                        const movingPiece = this.board.getMovingPiece();
                                        if(movingPiece === null || movingPiece === undefined) //Can't move if no piece is selected
                                            break;
                                        
                                        if(movingPiece.isMoving())
                                            break;

                                        this.move = [
                                            [movingPiece.getRow(), movingPiece.getColumn()],
                                            position
                                        ];
                                        
                                        this.board.playDownTiles();
                                        this.board.highlightTiles([this.move[1]]);
                                        this.startMove(this.move[0]);
                                        this.board.movePiece(this.move[0], this.move[1]);
                                }
                            }               
                            this.isPicking = false;	   
                        }
                    }
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    

    // ---------- GAME CYCLE -----------

    update(t){

        if(!this.board.loaded)
            return;

        if(this.gameOver)
            return;

        /** FILLING BOARD **/
        if(this.fillingBoard){
            if(!this.isPicking){
                switch(this.gameMode){
                    case 1: //Players are both human
                        this.getFillPositions();
                        break;
                    case 2: //Player 1 -> human; Player 2 -> CPU
                        if(this.player == 1){
                            this.getFillPositions();
                        }else{
                            this.chooseFillPosition();
                        }
                        break;
                    case 3: //Players are both CPU
                        this.chooseFillPosition();
                        break;
                    default: 
                        return;
                }
            }
        }
        /** GAME **/
        else {
            if(this.cpuIsMoving){
                const movingPiece = this.board.getMovingPiece();
                
                if(!movingPiece.isMoving()){
                    if(this.move.length > 2){
                        this.finishMove(this.move[0], this.move[1]);
                        this.move.shift();
                        this.startMove(this.move[0]);
                        movingPiece.move(this.move[0], this.move[1], this.board.getMaxHeight());
                    }else{
                        this.finishMove(this.move[0], this.move[1]);
                        this.cpuIsMoving = false;
                        this.move = null;
                        this.board.finishPieceMove();
                        this.board.removeOuterFrogs();
                        this.checkGameOver()
                    }
                }
            }
            else if(this.playerStartMoving){
                const movingPiece = this.board.getMovingPiece();
                
                if(!movingPiece.isMoving() && !this.isPicking){
                    this.finishMove(this.move[0], this.move[1]);
                    this.board.playDownTiles();
                    this.isPicking = true;
                    this.getValidMoves(this.move[1]);
                    this.move = null;
                }
            }
            else if(!this.isPicking && !this.selectedPiece){
                switch(this.gameMode){
                    case 1: //Players are both human
                        this.getPlayerFrogs();
                        break;
                    case 2: //Player 1 -> human; Player 2 -> CPU
                        if(this.player == 1){
                            this.getPlayerFrogs();
                        }else{
                            this.chooseJumpPosition();
                        }
                        break;
                    case 3: //Players are both CPU
                        if(this.updateWait())
                            return;
                        this.chooseJumpPosition();
                        break;
                    default: 
                        return;
                }
            }
        }
    }

    display() {
        this.pickResults();
        this.scene.clearPickRegistration();

        this.board.display();
    }
}