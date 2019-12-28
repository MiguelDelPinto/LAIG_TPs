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
        
        this.gameMode = gameMode || 3;

        this.fillingBoard = true; //In the beggining of the game, players have to fill the board with frogs

        //If serverCall is true, there was a call to the server and no other call will be made 
        this.serverCall = false;
    }

    getPlayerColor(){
        if(this.player == 1)
            return "blue";
        
        return "yellow";
    }

    nextPlayer(){
        this.player = (this.player+2) % 2 + 1;
    }

    // ---------- GAME LOGIC -----------

    // Choosing a fill position, in the beginning of the game
    chooseFillPosition() {

        if(!this.serverCall){
            this.serverCall = true;
            serverCpuFillChoose(this.board.pieces, data => this.handleFillPosition(data));    // O segundo argumento é assim para poder chamar o this.board a partir do handler (senão dava undefined)
        }        

    }

    // Generates possible fill positions
    getFillPositions() {
        if(!this.serverCall){
            serverValidFillPositions(this.board.pieces, this.handlePositions);
            this.serverCall = true;
        }

        if(this.handlePosition === []){
            this.fillingBoard = false;
            return;
        }
    }

    // Generates possible jump positions
    getJumpPositions(position) {
        if(!this.serverCall){
            serverValidJumpPosition(this.board.pieces, position, this.handlePositions);
            this.serverCall = true;
        }
    }


    // ---------- REQUEST HANDLERS -----------

    // Handles a newly generated fill position [x, y] from the request
    handleFillPosition(data) {
        let position = JSON.parse(data.target.response);

        if(position === undefined) {
            console.log("ERROR: choosing fill position");
            return;
        }

        if(position === []) {
            console.log("INVALID: no valid fill positions left");
            return;
        }

        this.board.setPiecePosition(position, this.getPlayerColor());
        this.nextPlayer();

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

    update(t){

        if(!this.board.loaded)
            return;

        if(this.fillingBoard){
            switch(this.gameMode){
                case 1: //Players are both human
                    this.getFillPositions();
                    break;
                case 2: //Player 1 -> human; Player 2 -> CPU
                    if(player == 1){
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

    display() {
        this.board.display();
    }
}