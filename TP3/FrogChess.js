/**
 * FrogChess
 * @constructor
 * @param scene - Reference to MyScene object
 */
class FrogChess extends CGFobject {
    constructor(scene, board) {
        super(scene);
        this.scene = scene;

        // TODO this.board = board;   (passes from menu, could be a lake or normal board)

        this.board = new MyBoard(scene);
    }


    // ---------- GAME LOGIC -----------

    // Choosing a fill position, in the beginning of the game
    chooseFillPosition() {
        serverCpuFillChoose(this.board.pieces, this.handlePosition);
    }

    // Generates possible fill positions
    getFillPositions() {
        serverValidFillPositions(this.board.pieces, this.handlePositions);
    }

    // Generates possible jump positions
    getJumpPositions(position) {
        serverValidJumpPosition(this.board.pieces, position, this.handlePositions);
    }


    // ---------- REQUEST HANDLERS -----------
    
    // Parses a position [x, y] from the request
    handlePosition(data) {
        let position = JSON.parse(data.target.response);
        this.next_position = position;
        console.log(position);
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


    

    display() {
        
    }
}